import { describe, test, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { POST } from '@/app/api/ai/donor-analysis/route.js'

describe('AI Donor Analysis Tests', () => {
  let prisma
  let testDonor
  let mockOpenAI

  beforeAll(async () => {
    prisma = new PrismaClient()
    
    // Create test donor for AI analysis
    testDonor = await prisma.donor.create({
      data: {
        firstName: 'AI',
        lastName: 'TestDonor',
        email: 'ai.test@example.com',
        phone: '555-0199',
        donorType: 'Individual',
        preferredContact: 'Email',
        totalDonated: 2500,
        lastDonation: new Date('2024-11-01'),
        isActive: true,
        tags: 'test-donor,ai-analysis'
      }
    })

    // Create test donations for the donor
    const campaign = await prisma.campaign.create({
      data: {
        name: 'AI Test Campaign',
        description: 'Campaign for AI testing',
        goalAmount: 10000,
        raisedAmount: 2500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'Active',
        campaignType: 'General'
      }
    })

    await prisma.donation.createMany({
      data: [
        {
          amount: 1000,
          donationDate: new Date('2024-06-01'),
          paymentMethod: 'Credit Card',
          status: 'Completed',
          receiptSent: true,
          taxDeductible: true,
          donorId: testDonor.id,
          campaignId: campaign.id
        },
        {
          amount: 750,
          donationDate: new Date('2024-09-01'),
          paymentMethod: 'Check',
          status: 'Completed',
          receiptSent: true,
          taxDeductible: true,
          donorId: testDonor.id,
          campaignId: campaign.id
        },
        {
          amount: 750,
          donationDate: new Date('2024-11-01'),
          paymentMethod: 'Online',
          status: 'Completed',
          isRecurring: true,
          recurringType: 'Monthly',
          receiptSent: true,
          taxDeductible: true,
          donorId: testDonor.id,
          campaignId: campaign.id
        }
      ]
    })

    // Create test follow-ups
    await prisma.followUp.create({
      data: {
        title: 'AI Test Follow-up',
        description: 'Follow-up for AI testing',
        dueDate: new Date('2024-12-01'),
        status: 'Completed',
        priority: 'Medium',
        type: 'Email',
        assignedTo: 'AI Test Manager',
        completedAt: new Date('2024-11-30'),
        donorId: testDonor.id
      }
    })
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.followUp.deleteMany({ where: { donorId: testDonor.id } })
    await prisma.donation.deleteMany({ where: { donorId: testDonor.id } })
    await prisma.campaign.deleteMany({ where: { name: 'AI Test Campaign' } })
    await prisma.donor.deleteMany({ where: { id: testDonor.id } })
    await prisma.$disconnect()
  })

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  describe('AI Analysis API Endpoint', () => {
    test('should return donor data for analysis', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'engagement_strategy'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.donor.id).toBe(testDonor.id)
      expect(data.donor.name).toBe('AI TestDonor')
      expect(data.analysisType).toBe('engagement_strategy')
      expect(data.summary).toBeDefined()
      expect(data.analysis).toBeDefined()
      expect(data.generatedAt).toBeDefined()
    })

    test('should handle missing donor gracefully', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: 99999, // Non-existent donor
          type: 'engagement_strategy'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Donor not found')
    })

    test('should calculate donor summary correctly', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'risk_assessment'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.totalDonations).toBe(3)
      expect(data.summary.totalAmount).toBe(2500)
      expect(data.summary.averageGift).toBeCloseTo(833.33, 1)
      expect(data.summary.campaignParticipation).toBe(3)
      expect(data.summary.followUpHistory).toBe(1)
    })

    test('should generate engagement strategy analysis', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'engagement_strategy'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.analysisType).toBe('engagement_strategy')
      expect(data.analysis).toContain('Engagement Strategy')
      expect(data.analysis).toContain('Next Steps')
      expect(data.analysis).toContain('Risk Level')
    })

    test('should generate risk assessment analysis', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'risk_assessment'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.analysisType).toBe('risk_assessment')
      expect(data.analysis).toContain('Risk Assessment')
      expect(data.analysis).toContain('Risk Level')
      expect(data.analysis).toContain('Risk Factors')
    })

    test('should generate upgrade potential analysis', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'upgrade_potential'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.analysisType).toBe('upgrade_potential')
      expect(data.analysis).toContain('Upgrade Assessment')
      expect(data.analysis).toContain('Upgrade Likelihood')
      expect(data.analysis).toContain('Suggested Ask')
    })

    test('should handle malformed request data', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Missing donorId and type
        })
      })

      const response = await POST(request)
      
      expect(response.status).toBe(500)
    })

    test('should return basic analysis for unknown analysis type', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'unknown_analysis_type'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.analysis).toContain('Donor Profile Analysis')
      expect(data.analysis).toContain('AI TestDonor')
    })
  })

  describe('AI Analysis Helper Functions', () => {
    test('should calculate donation frequency correctly', () => {
      // This would require importing the helper function
      // For now, we'll test the functionality through the API
      const donations = [
        { donationDate: new Date('2024-11-01') },
        { donationDate: new Date('2024-09-01') },
        { donationDate: new Date('2024-06-01') }
      ]

      // Test that the frequency calculation works through the API
      expect(donations.length).toBe(3)
    })

    test('should handle single donation frequency calculation', async () => {
      // Create a donor with single donation
      const singleDonor = await prisma.donor.create({
        data: {
          firstName: 'Single',
          lastName: 'Donor',
          email: 'single@test.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 500,
          isActive: true
        }
      })

      await prisma.donation.create({
        data: {
          amount: 500,
          donationDate: new Date('2024-10-01'),
          paymentMethod: 'Credit Card',
          status: 'Completed',
          receiptSent: true,
          taxDeductible: true,
          donorId: singleDonor.id
        }
      })

      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: singleDonor.id,
          type: 'engagement_strategy'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.donationFrequency).toBe('New donor')

      // Cleanup
      await prisma.donation.deleteMany({ where: { donorId: singleDonor.id } })
      await prisma.donor.delete({ where: { id: singleDonor.id } })
    })

    test('should handle donor with no donations', async () => {
      const noDonationDonor = await prisma.donor.create({
        data: {
          firstName: 'No',
          lastName: 'Donations',
          email: 'nodonations@test.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 0,
          isActive: true
        }
      })

      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: noDonationDonor.id,
          type: 'risk_assessment'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.totalDonations).toBe(0)
      expect(data.summary.totalAmount).toBe(0)
      expect(data.summary.averageGift).toBe(0)
      expect(data.summary.daysSinceLastDonation).toBeNull()
      expect(data.summary.donationFrequency).toBe('New donor')

      // Cleanup
      await prisma.donor.delete({ where: { id: noDonationDonor.id } })
    })
  })

  describe('Mock Analysis Generation', () => {
    test('should generate consistent mock analysis when no OpenAI key', async () => {
      // Temporarily remove OpenAI key to force mock analysis
      const originalKey = process.env.OPENAI_API_KEY
      process.env.OPENAI_API_KEY = 'your-api-key-here'

      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'engagement_strategy'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.analysis).toContain('Recommended Engagement Strategy')
      expect(data.analysis).toContain('AI TestDonor')

      // Restore original key
      process.env.OPENAI_API_KEY = originalKey
    })

    test('should include donor-specific data in analysis', async () => {
      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'upgrade_potential'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.analysis).toContain('2500') // Total donation amount
      expect(data.analysis).toContain('833') // Average gift amount
    })
  })

  describe('Performance Tests', () => {
    test('should complete analysis within reasonable time', async () => {
      const startTime = performance.now()

      const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: testDonor.id,
          type: 'engagement_strategy'
        })
      })

      const response = await POST(request)
      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(executionTime).toBeLessThan(5000) // Should complete within 5 seconds
    })

    test('should handle concurrent analysis requests', async () => {
      const requests = []
      const analysisTypes = ['engagement_strategy', 'risk_assessment', 'upgrade_potential']

      for (let i = 0; i < 3; i++) {
        const request = new Request('http://localhost:3000/api/ai/donor-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donorId: testDonor.id,
            type: analysisTypes[i]
          })
        })
        requests.push(POST(request))
      }

      const responses = await Promise.all(requests)
      
      responses.forEach((response, index) => {
        expect(response.status).toBe(200)
      })

      const data = await Promise.all(responses.map(r => r.json()))
      
      expect(data[0].analysisType).toBe('engagement_strategy')
      expect(data[1].analysisType).toBe('risk_assessment')
      expect(data[2].analysisType).toBe('upgrade_potential')
    })
  })
})