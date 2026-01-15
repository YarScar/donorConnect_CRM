import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single donation
export async function GET(request, { params }) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        donor: true,
        campaign: true,
        event: true
      }
    })
    
    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }
    
    return NextResponse.json(donation)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donation' }, { status: 500 })
  }
}

// PUT update donation
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    
    // Get the old donation to compare
    const oldDonation = await prisma.donation.findUnique({
      where: { id: parseInt(params.id) }
    })
    
    if (!oldDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }
    
    // Start a transaction to update donation and recalculate donor totals
    const result = await prisma.$transaction(async (tx) => {
      // Update the donation
      const donation = await tx.donation.update({
        where: { id: parseInt(params.id) },
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
      
      // Recalculate donor totals for the affected donor(s)
      const donorsToUpdate = new Set([oldDonation.donorId, donation.donorId])
      
      for (const donorId of donorsToUpdate) {
        const donorDonations = await tx.donation.findMany({
          where: { 
            donorId,
            status: 'Completed'
          },
          orderBy: { donationDate: 'desc' }
        })
        
        const totalDonated = donorDonations.reduce((sum, d) => sum + d.amount, 0)
        const lastDonation = donorDonations[0]?.donationDate || null
        
        await tx.donor.update({
          where: { id: donorId },
          data: {
            totalDonated,
            lastDonation
          }
        })
      }
      
      // Update campaign raised amounts for affected campaigns
      const campaignsToUpdate = new Set([oldDonation.campaignId, donation.campaignId].filter(Boolean))
      
      for (const campaignId of campaignsToUpdate) {
        const campaignDonations = await tx.donation.findMany({
          where: { 
            campaignId,
            status: 'Completed'
          }
        })
        const campaignTotal = campaignDonations.reduce((sum, d) => sum + d.amount, 0)
        
        await tx.campaign.update({
          where: { id: campaignId },
          data: { raisedAmount: campaignTotal }
        })
      }
      
      return donation
    })
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 })
  }
}

// DELETE donation
export async function DELETE(request, { params }) {
  try {
    await prisma.donation.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'Donation deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete donation' }, { status: 500 })
  }
}
