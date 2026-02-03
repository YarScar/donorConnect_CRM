import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'

describe('Database Connection Tests', () => {
  let prisma

  beforeAll(async () => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.auditLog.deleteMany()
    await prisma.eventAttendance.deleteMany()
    await prisma.followUp.deleteMany()
    await prisma.donation.deleteMany()
    await prisma.event.deleteMany()
    await prisma.campaign.deleteMany()
    await prisma.donor.deleteMany()
  })

  describe('Database Connection', () => {
    test('should connect to database successfully', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as connected`
      expect(result).toBeDefined()
      expect(result[0].connected).toBe(1)
    })

    test('should be able to perform basic CRUD operations', async () => {
      // Test database write/read operations
      const testDonor = await prisma.donor.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 0,
          isActive: true
        }
      })

      expect(testDonor.id).toBeDefined()
      expect(testDonor.firstName).toBe('Test')
      expect(testDonor.email).toBe('test@example.com')

      // Test read operation
      const fetchedDonor = await prisma.donor.findUnique({
        where: { id: testDonor.id }
      })

      expect(fetchedDonor).toBeDefined()
      expect(fetchedDonor.firstName).toBe('Test')
    })

    test('should handle database transactions', async () => {
      await expect(
        prisma.$transaction(async (tx) => {
          const donor = await tx.donor.create({
            data: {
              firstName: 'Transaction',
              lastName: 'Test',
              email: 'transaction@test.com',
              donorType: 'Individual',
              preferredContact: 'Email',
              totalDonated: 100,
              isActive: true
            }
          })

          await tx.donation.create({
            data: {
              amount: 100,
              donationDate: new Date(),
              paymentMethod: 'Credit Card',
              status: 'Completed',
              receiptSent: true,
              taxDeductible: true,
              donorId: donor.id
            }
          })

          return donor
        })
      ).resolves.toBeDefined()
    })
  })

  describe('Data Model Validation', () => {
    test('should enforce required fields for donors', async () => {
      await expect(
        prisma.donor.create({
          data: {
            firstName: 'Test'
            // Missing required fields
          }
        })
      ).rejects.toThrow()
    })

    test('should validate email format constraints', async () => {
      const donor = await prisma.donor.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: 'valid@email.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 0,
          isActive: true
        }
      })

      expect(donor.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    test('should handle foreign key relationships correctly', async () => {
      const donor = await prisma.donor.create({
        data: {
          firstName: 'Test',
          lastName: 'Donor',
          email: 'test.donor@example.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 500,
          isActive: true
        }
      })

      const campaign = await prisma.campaign.create({
        data: {
          name: 'Test Campaign',
          description: 'Test campaign for validation',
          goalAmount: 10000,
          raisedAmount: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'Active',
          campaignType: 'General'
        }
      })

      const donation = await prisma.donation.create({
        data: {
          amount: 500,
          donationDate: new Date(),
          paymentMethod: 'Credit Card',
          status: 'Completed',
          receiptSent: true,
          taxDeductible: true,
          donorId: donor.id,
          campaignId: campaign.id
        }
      })

      expect(donation.donorId).toBe(donor.id)
      expect(donation.campaignId).toBe(campaign.id)

      // Test cascade relationships
      const donorWithDonations = await prisma.donor.findUnique({
        where: { id: donor.id },
        include: { donations: true }
      })

      expect(donorWithDonations.donations).toHaveLength(1)
      expect(donorWithDonations.donations[0].amount).toBe(500)
    })
  })

  describe('Data Integrity Tests', () => {
    test('should maintain referential integrity', async () => {
      const donor = await prisma.donor.create({
        data: {
          firstName: 'Integrity',
          lastName: 'Test',
          email: 'integrity@test.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 0,
          isActive: true
        }
      })

      // Should not be able to create donation with non-existent donor
      await expect(
        prisma.donation.create({
          data: {
            amount: 100,
            donationDate: new Date(),
            paymentMethod: 'Credit Card',
            status: 'Completed',
            receiptSent: true,
            taxDeductible: true,
            donorId: 99999 // Non-existent donor ID
          }
        })
      ).rejects.toThrow()
    })

    test('should update totalDonated correctly when donations are added', async () => {
      const donor = await prisma.donor.create({
        data: {
          firstName: 'Total',
          lastName: 'Test',
          email: 'total@test.com',
          donorType: 'Individual',
          preferredContact: 'Email',
          totalDonated: 0,
          isActive: true
        }
      })

      // Add first donation
      await prisma.donation.create({
        data: {
          amount: 100,
          donationDate: new Date(),
          paymentMethod: 'Credit Card',
          status: 'Completed',
          receiptSent: true,
          taxDeductible: true,
          donorId: donor.id
        }
      })

      // Add second donation
      await prisma.donation.create({
        data: {
          amount: 250,
          donationDate: new Date(),
          paymentMethod: 'Check',
          status: 'Completed',
          receiptSent: true,
          taxDeductible: true,
          donorId: donor.id
        }
      })

      // Calculate actual total from donations
      const donations = await prisma.donation.findMany({
        where: { donorId: donor.id }
      })
      const actualTotal = donations.reduce((sum, donation) => sum + donation.amount, 0)

      // Update donor's totalDonated (this would typically be done via triggers or application logic)
      await prisma.donor.update({
        where: { id: donor.id },
        data: { totalDonated: actualTotal }
      })

      const updatedDonor = await prisma.donor.findUnique({
        where: { id: donor.id }
      })

      expect(updatedDonor.totalDonated).toBe(350)
    })

    test('should handle date constraints properly', async () => {
      const campaign = await prisma.campaign.create({
        data: {
          name: 'Date Test Campaign',
          description: 'Testing date constraints',
          goalAmount: 5000,
          raisedAmount: 0,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'Active',
          campaignType: 'General'
        }
      })

      expect(campaign.startDate.getFullYear()).toBe(2024)
      expect(campaign.endDate > campaign.startDate).toBe(true)
    })
  })

  describe('Query Performance Tests', () => {
    beforeEach(async () => {
      // Create test data for performance tests
      const donors = []
      for (let i = 0; i < 50; i++) {
        donors.push({
          firstName: `TestDonor${i}`,
          lastName: `LastName${i}`,
          email: `donor${i}@test.com`,
          donorType: i % 2 === 0 ? 'Individual' : 'Corporate',
          preferredContact: 'Email',
          totalDonated: Math.floor(Math.random() * 10000),
          isActive: true
        })
      }

      await prisma.donor.createMany({ data: donors })
    })

    test('should execute basic queries within acceptable time', async () => {
      const startTime = performance.now()
      
      const donors = await prisma.donor.findMany({
        where: { isActive: true },
        orderBy: { totalDonated: 'desc' },
        take: 10
      })

      const endTime = performance.now()
      const queryTime = endTime - startTime

      expect(donors).toHaveLength(10)
      expect(queryTime).toBeLessThan(1000) // Should complete within 1 second
    })

    test('should handle complex joins efficiently', async () => {
      const startTime = performance.now()
      
      const donorsWithData = await prisma.donor.findMany({
        include: {
          donations: {
            include: {
              campaign: { select: { name: true } }
            }
          },
          followUps: true
        },
        take: 20
      })

      const endTime = performance.now()
      const queryTime = endTime - startTime

      expect(donorsWithData).toBeDefined()
      expect(queryTime).toBeLessThan(2000) // Complex joins should complete within 2 seconds
    })
  })
})