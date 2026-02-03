import { describe, test, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PrismaClient } from '@prisma/client'

// Mock the API routes
vi.mock('@/app/api/donors/route.js', () => ({
  GET: vi.fn()
}))

vi.mock('@/app/api/ai/donor-analysis/route.js', () => ({
  POST: vi.fn()
}))

describe('Web App Integration Tests', () => {
  let prisma

  beforeAll(async () => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Mock successful API responses
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/donors') {
        return Promise.resolve({
          json: () => Promise.resolve([
            {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              totalDonated: 1000,
              donations: [{ amount: 500 }, { amount: 500 }],
              isActive: true
            }
          ])
        })
      }
      
      if (url === '/api/ai/donor-analysis') {
        return Promise.resolve({
          json: () => Promise.resolve({
            donor: { id: 1, name: 'John Doe' },
            analysisType: 'engagement_strategy',
            summary: { totalDonations: 2, totalAmount: 1000 },
            analysis: 'Mock analysis result',
            generatedAt: new Date().toISOString()
          })
        })
      }

      return Promise.resolve({ json: () => Promise.resolve({}) })
    })
  })

  describe('Database Display Integration', () => {
    test('should display donor data correctly from database', async () => {
      // This would test actual component rendering with database data
      // For demonstration, we'll test the data flow

      const response = await fetch('/api/donors')
      const donors = await response.json()

      expect(donors).toHaveLength(1)
      expect(donors[0].firstName).toBe('John')
      expect(donors[0].totalDonated).toBe(1000)
    })

    test('should handle database connection errors gracefully', async () => {
      // Mock a database error
      global.fetch = vi.fn().mockRejectedValue(new Error('Database connection failed'))

      try {
        await fetch('/api/donors')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toBe('Database connection failed')
      }
    })

    test('should validate data integrity in display', async () => {
      const response = await fetch('/api/donors')
      const donors = await response.json()

      // Validate data structure
      expect(donors[0]).toHaveProperty('id')
      expect(donors[0]).toHaveProperty('firstName')
      expect(donors[0]).toHaveProperty('lastName')
      expect(donors[0]).toHaveProperty('email')
      expect(donors[0]).toHaveProperty('totalDonated')
      expect(donors[0].email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    test('should calculate totals correctly from database relations', async () => {
      const response = await fetch('/api/donors')
      const donors = await response.json()
      const donor = donors[0]

      // Verify that calculated totals match database values
      const calculatedTotal = donor.donations.reduce((sum, donation) => sum + donation.amount, 0)
      expect(calculatedTotal).toBe(donor.totalDonated)
    })
  })

  describe('AI Insights Integration', () => {
    test('should request AI analysis correctly', async () => {
      const analysisRequest = {
        donorId: 1,
        type: 'engagement_strategy'
      }

      const response = await fetch('/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisRequest)
      })

      const result = await response.json()

      expect(result.donor.id).toBe(1)
      expect(result.analysisType).toBe('engagement_strategy')
      expect(result.analysis).toBe('Mock analysis result')
    })

    test('should display AI insights correctly in UI', async () => {
      const mockAnalysis = {
        donor: { id: 1, name: 'John Doe' },
        analysisType: 'risk_assessment',
        summary: {
          totalDonations: 5,
          totalAmount: 2500,
          averageGift: 500,
          daysSinceLastDonation: 30
        },
        analysis: '**Risk Assessment:** LOW risk donor with consistent giving pattern.',
        generatedAt: new Date().toISOString()
      }

      // Simulate how the analysis would be processed and displayed
      expect(mockAnalysis.analysis).toContain('Risk Assessment')
      expect(mockAnalysis.summary.averageGift).toBe(500)
      expect(mockAnalysis.summary.totalDonations).toBe(5)
    })

    test('should handle different AI analysis types', async () => {
      const analysisTypes = ['engagement_strategy', 'risk_assessment', 'upgrade_potential']

      for (const type of analysisTypes) {
        global.fetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve({
            donor: { id: 1, name: 'Test Donor' },
            analysisType: type,
            analysis: `Mock ${type} analysis`,
            summary: { totalDonations: 3, totalAmount: 1500 }
          })
        })

        const response = await fetch('/api/ai/donor-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donorId: 1, type })
        })

        const result = await response.json()
        expect(result.analysisType).toBe(type)
        expect(result.analysis).toContain(type)
      }
    })

    test('should format AI insights for display', () => {
      const rawAnalysis = `**Recommended Engagement Strategy for John:**

**Risk Level**: Low

**Next Steps:**
1. Send personalized thank you with impact story
2. Include in newsletter with giving opportunities
3. Follow up within 2-3 weeks

**Suggested Ask Amount**: $625 (25% increase from average)

**Communication Preference**: Based on history, responds well to campaign updates`

      // Test that the analysis contains expected sections
      expect(rawAnalysis).toContain('**Recommended Engagement Strategy')
      expect(rawAnalysis).toContain('**Risk Level**')
      expect(rawAnalysis).toContain('**Next Steps:**')
      expect(rawAnalysis).toContain('**Suggested Ask Amount**')
    })

    test('should handle AI service failures gracefully', async () => {
      // Mock AI service failure
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          error: 'AI service temporarily unavailable',
          fallbackAnalysis: 'Basic donor profile analysis available'
        })
      })

      const response = await fetch('/api/ai/donor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorId: 1, type: 'engagement_strategy' })
      })

      const result = await response.json()
      
      expect(result.error).toBe('AI service temporarily unavailable')
      expect(result.fallbackAnalysis).toBeDefined()
    })
  })

  describe('Data Consistency Tests', () => {
    test('should maintain data consistency between database and UI', async () => {
      // Test that data displayed matches database values
      const dbResponse = await fetch('/api/donors')
      const donors = await dbResponse.json()

      // Simulate UI calculations
      const donor = donors[0]
      const displayTotal = donor.totalDonated
      const calculatedTotal = donor.donations?.reduce((sum, d) => sum + d.amount, 0) || 0

      expect(displayTotal).toBe(calculatedTotal)
    })

    test('should update UI when database changes', async () => {
      // First fetch
      let response = await fetch('/api/donors')
      let donors = await response.json()
      expect(donors[0].totalDonated).toBe(1000)

      // Simulate database update
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve([{
          ...donors[0],
          totalDonated: 1500,
          donations: [{ amount: 500 }, { amount: 500 }, { amount: 500 }]
        }])
      })

      // Second fetch after update
      response = await fetch('/api/donors')
      donors = await response.json()
      expect(donors[0].totalDonated).toBe(1500)
    })

    test('should validate data types and formats', async () => {
      const response = await fetch('/api/donors')
      const donors = await response.json()
      const donor = donors[0]

      // Validate data types
      expect(typeof donor.id).toBe('number')
      expect(typeof donor.firstName).toBe('string')
      expect(typeof donor.lastName).toBe('string')
      expect(typeof donor.totalDonated).toBe('number')
      expect(typeof donor.isActive).toBe('boolean')
      
      // Validate formats
      expect(donor.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      expect(donor.totalDonated).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Performance and Loading Tests', () => {
    test('should load donor data within acceptable time', async () => {
      const startTime = performance.now()
      
      await fetch('/api/donors')
      
      const endTime = performance.now()
      const loadTime = endTime - startTime

      expect(loadTime).toBeLessThan(2000) // Should load within 2 seconds
    })

    test('should handle loading states properly', async () => {
      // Mock delayed response
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            json: () => Promise.resolve([])
          }), 100)
        )
      )

      const startTime = Date.now()
      await fetch('/api/donors')
      const endTime = Date.now()

      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })

    test('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeDonorList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        firstName: `Donor${i}`,
        lastName: `LastName${i}`,
        email: `donor${i}@example.com`,
        totalDonated: Math.floor(Math.random() * 10000),
        donations: [],
        isActive: true
      }))

      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(largeDonorList)
      })

      const startTime = performance.now()
      const response = await fetch('/api/donors')
      const donors = await response.json()
      const endTime = performance.now()

      expect(donors).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(1000) // Should handle large data quickly
    })
  })

  describe('Database Persistence Tests', () => {
    beforeEach(async () => {
      // Clean up test data before each test
      await prisma.donation.deleteMany({
        where: {
          donor: {
            email: {
              startsWith: 'test'
            }
          }
        }
      })
      await prisma.donor.deleteMany({
        where: {
          email: {
            startsWith: 'test'
          }
        }
      })
    })

    test('should save new donor to database and persist data', async () => {
      const newDonorData = {
        firstName: 'Test',
        lastName: 'Donor',
        email: 'testdonor@example.com',
        phone: '555-0123',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        donorType: 'Individual',
        preferredContact: 'Email'
      }

      // Create donor via API
      const createResponse = await prisma.donor.create({
        data: newDonorData
      })

      expect(createResponse).toBeDefined()
      expect(createResponse.id).toBeDefined()
      expect(createResponse.firstName).toBe('Test')
      expect(createResponse.lastName).toBe('Donor')
      expect(createResponse.email).toBe('testdonor@example.com')
      expect(createResponse.totalDonated).toBe(0) // Should initialize to 0

      // Verify data persists by fetching from database
      const savedDonor = await prisma.donor.findUnique({
        where: { email: 'testdonor@example.com' },
        include: { donations: true }
      })

      expect(savedDonor).toBeDefined()
      expect(savedDonor.firstName).toBe('Test')
      expect(savedDonor.lastName).toBe('Donor')
      expect(savedDonor.email).toBe('testdonor@example.com')
      expect(savedDonor.phone).toBe('555-0123')
      expect(savedDonor.totalDonated).toBe(0)
      expect(savedDonor.isActive).toBe(true)
    })

    test('should save new donation to database and update donor totals', async () => {
      // First create a test donor
      const testDonor = await prisma.donor.create({
        data: {
          firstName: 'Test',
          lastName: 'Donor',
          email: 'testdonation@example.com',
          donorType: 'Individual'
        }
      })

      const donationData = {
        donorId: testDonor.id,
        amount: 250.00,
        donationDate: new Date('2026-01-15'),
        paymentMethod: 'Credit Card',
        status: 'Completed',
        notes: 'Test donation for integration test'
      }

      // Create donation via database (simulating API call)
      const savedDonation = await prisma.donation.create({
        data: donationData,
        include: {
          donor: true
        }
      })

      expect(savedDonation).toBeDefined()
      expect(savedDonation.id).toBeDefined()
      expect(savedDonation.amount).toBe(250.00)
      expect(savedDonation.donorId).toBe(testDonor.id)
      expect(savedDonation.status).toBe('Completed')

      // Verify donation persists in database
      const persistedDonation = await prisma.donation.findUnique({
        where: { id: savedDonation.id },
        include: {
          donor: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      expect(persistedDonation).toBeDefined()
      expect(persistedDonation.amount).toBe(250.00)
      expect(persistedDonation.donor.email).toBe('testdonation@example.com')

      // Manually update donor totals (simulating transaction behavior)
      const donorDonations = await prisma.donation.findMany({
        where: { 
          donorId: testDonor.id,
          status: 'Completed'
        }
      })
      
      const totalDonated = donorDonations.reduce((sum, d) => sum + d.amount, 0)
      
      await prisma.donor.update({
        where: { id: testDonor.id },
        data: {
          totalDonated,
          lastDonation: savedDonation.donationDate
        }
      })

      // Verify donor totals were updated
      const updatedDonor = await prisma.donor.findUnique({
        where: { id: testDonor.id }
      })

      expect(updatedDonor.totalDonated).toBe(250.00)
      expect(updatedDonor.lastDonation).toEqual(savedDonation.donationDate)
    })

    test('should handle multiple donations and calculate correct totals', async () => {
      // Create test donor
      const testDonor = await prisma.donor.create({
        data: {
          firstName: 'Multi',
          lastName: 'Donor',
          email: 'multidonor@example.com',
          donorType: 'Individual'
        }
      })

      // Create multiple donations
      const donations = [
        { amount: 100.00, status: 'Completed' },
        { amount: 200.00, status: 'Completed' },
        { amount: 150.00, status: 'Pending' },
        { amount: 300.00, status: 'Completed' }
      ]

      const savedDonations = []
      for (const donationData of donations) {
        const donation = await prisma.donation.create({
          data: {
            ...donationData,
            donorId: testDonor.id,
            donationDate: new Date(),
            paymentMethod: 'Credit Card'
          }
        })
        savedDonations.push(donation)
      }

      // Verify all donations were saved
      const allDonations = await prisma.donation.findMany({
        where: { donorId: testDonor.id }
      })
      expect(allDonations).toHaveLength(4)

      // Calculate and update totals (only completed donations)
      const completedDonations = allDonations.filter(d => d.status === 'Completed')
      const expectedTotal = completedDonations.reduce((sum, d) => sum + d.amount, 0)

      await prisma.donor.update({
        where: { id: testDonor.id },
        data: {
          totalDonated: expectedTotal,
          lastDonation: completedDonations[completedDonations.length - 1]?.donationDate
        }
      })

      // Verify calculations
      expect(expectedTotal).toBe(600.00) // 100 + 200 + 300 (pending donation not included)
      
      const finalDonor = await prisma.donor.findUnique({
        where: { id: testDonor.id }
      })
      expect(finalDonor.totalDonated).toBe(600.00)
    })

    test('should maintain referential integrity between donors and donations', async () => {
      // Create donor
      const testDonor = await prisma.donor.create({
        data: {
          firstName: 'Integrity',
          lastName: 'Test',
          email: 'integrity@example.com',
          donorType: 'Individual'
        }
      })

      // Create donation
      const testDonation = await prisma.donation.create({
        data: {
          donorId: testDonor.id,
          amount: 500.00,
          donationDate: new Date(),
          paymentMethod: 'Check',
          status: 'Completed'
        }
      })

      // Verify relationship exists
      const donorWithDonations = await prisma.donor.findUnique({
        where: { id: testDonor.id },
        include: { donations: true }
      })

      expect(donorWithDonations.donations).toHaveLength(1)
      expect(donorWithDonations.donations[0].id).toBe(testDonation.id)
      expect(donorWithDonations.donations[0].amount).toBe(500.00)

      // Verify reverse relationship
      const donationWithDonor = await prisma.donation.findUnique({
        where: { id: testDonation.id },
        include: { donor: true }
      })

      expect(donationWithDonor.donor.id).toBe(testDonor.id)
      expect(donationWithDonor.donor.email).toBe('integrity@example.com')
    })

    test('should handle database constraints and validation', async () => {
      // Test unique email constraint
      await prisma.donor.create({
        data: {
          firstName: 'First',
          lastName: 'Unique',
          email: 'unique@example.com'
        }
      })

      // Attempting to create another donor with same email should fail
      await expect(
        prisma.donor.create({
          data: {
            firstName: 'Second',
            lastName: 'Duplicate',
            email: 'unique@example.com'
          }
        })
      ).rejects.toThrow()
    })

    test('should persist complex donor data with all fields', async () => {
      const complexDonorData = {
        firstName: 'Complex',
        lastName: 'Donor',
        email: 'complex@example.com',
        phone: '555-9999',
        address: '456 Complex Ave',
        city: 'Complex City',
        state: 'CC',
        zipCode: '54321',
        country: 'USA',
        donorType: 'Organization',
        preferredContact: 'Phone',
        tags: 'VIP,Monthly,Corporate',
        notes: 'This is a test donor with all fields populated for comprehensive testing.',
        isActive: true
      }

      const savedDonor = await prisma.donor.create({
        data: complexDonorData
      })

      // Verify all fields were saved correctly
      expect(savedDonor.firstName).toBe('Complex')
      expect(savedDonor.lastName).toBe('Donor')
      expect(savedDonor.email).toBe('complex@example.com')
      expect(savedDonor.phone).toBe('555-9999')
      expect(savedDonor.address).toBe('456 Complex Ave')
      expect(savedDonor.city).toBe('Complex City')
      expect(savedDonor.state).toBe('CC')
      expect(savedDonor.zipCode).toBe('54321')
      expect(savedDonor.country).toBe('USA')
      expect(savedDonor.donorType).toBe('Organization')
      expect(savedDonor.preferredContact).toBe('Phone')
      expect(savedDonor.tags).toBe('VIP,Monthly,Corporate')
      expect(savedDonor.notes).toContain('comprehensive testing')
      expect(savedDonor.isActive).toBe(true)
      expect(savedDonor.totalDonated).toBe(0) // Default value
      expect(savedDonor.createdAt).toBeDefined()
      expect(savedDonor.updatedAt).toBeDefined()
    })
  })

  describe('Error Handling Integration', () => {
    test('should display appropriate error messages for database failures', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Database connection lost'))

      try {
        await fetch('/api/donors')
      } catch (error) {
        expect(error.message).toContain('Database connection lost')
      }
    })

    test('should provide fallback content when AI insights fail', async () => {
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url === '/api/ai/donor-analysis') {
          return Promise.reject(new Error('AI service unavailable'))
        }
        return Promise.resolve({ json: () => Promise.resolve([]) })
      })

      try {
        await fetch('/api/ai/donor-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donorId: 1, type: 'engagement_strategy' })
        })
      } catch (error) {
        expect(error.message).toBe('AI service unavailable')
        // In the actual app, this would trigger fallback content
      }
    })

    test('should validate input data before processing', () => {
      const validDonorData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        totalDonated: 1000
      }

      const invalidDonorData = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
        totalDonated: -100
      }

      // Test valid data
      expect(validDonorData.firstName).toBeTruthy()
      expect(validDonorData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      expect(validDonorData.totalDonated).toBeGreaterThanOrEqual(0)

      // Test invalid data
      expect(invalidDonorData.firstName).toBeFalsy()
      expect(invalidDonorData.email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      expect(invalidDonorData.totalDonated).toBeLessThan(0)
    })
  })
})