import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET all donations
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            donorType: true
          }
        },
        campaign: {
          select: {
            id: true,
            name: true,
            campaignType: true
          }
        },
        event: {
          select: {
            id: true,
            name: true,
            eventType: true,
            eventDate: true
          }
        }
      },
      orderBy: {
        donationDate: 'desc'
      }
    })
    return NextResponse.json(donations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

// POST create new donation
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Start a transaction to update both donation and donor
    const result = await prisma.$transaction(async (tx) => {
      // Create the donation
      const donation = await tx.donation.create({
        data: {
          ...data,
          donationDate: new Date(data.donationDate)
        },
        include: {
          donor: true,
          campaign: true,
          event: true
        }
      })
      
      // Update donor's calculated fields if donation is completed
      if (donation.status === 'Completed') {
        // Get all completed donations for this donor
        const donorDonations = await tx.donation.findMany({
          where: { 
            donorId: donation.donorId,
            status: 'Completed'
          },
          orderBy: { donationDate: 'desc' }
        })
        
        const totalDonated = donorDonations.reduce((sum, d) => sum + d.amount, 0)
        const lastDonation = donorDonations[0]?.donationDate || null
        
        // Update donor record
        await tx.donor.update({
          where: { id: donation.donorId },
          data: {
            totalDonated,
            lastDonation
          }
        })
        
        // Update campaign raised amount if donation is linked to campaign
        if (donation.campaignId) {
          const campaignDonations = await tx.donation.findMany({
            where: { 
              campaignId: donation.campaignId,
              status: 'Completed'
            }
          })
          const campaignTotal = campaignDonations.reduce((sum, d) => sum + d.amount, 0)
          
          await tx.campaign.update({
            where: { id: donation.campaignId },
            data: { raisedAmount: campaignTotal }
          })
        }
      }
      
      return donation
    })
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    logger.error('Error creating donation', { error: error.message, stack: error.stack })
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 })
  }
}
