import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST recalculate all totals and derived fields
export async function POST(request) {
  try {
    console.log('Starting data recalculation...')
    
    const result = await prisma.$transaction(async (tx) => {
      // Get all donors
      const donors = await tx.donor.findMany()
      let updatedDonors = 0
      
      // Update each donor's totals
      for (const donor of donors) {
        const donations = await tx.donation.findMany({
          where: { 
            donorId: donor.id,
            status: 'Completed'
          },
          orderBy: { donationDate: 'desc' }
        })
        
        const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
        const lastDonation = donations[0]?.donationDate || null
        
        // Only update if values have changed
        if (donor.totalDonated !== totalDonated || donor.lastDonation !== lastDonation) {
          await tx.donor.update({
            where: { id: donor.id },
            data: {
              totalDonated,
              lastDonation
            }
          })
          updatedDonors++
        }
      }
      
      // Get all campaigns and update raised amounts
      const campaigns = await tx.campaign.findMany()
      let updatedCampaigns = 0
      
      for (const campaign of campaigns) {
        const donations = await tx.donation.findMany({
          where: { 
            campaignId: campaign.id,
            status: 'Completed'
          }
        })
        
        const raisedAmount = donations.reduce((sum, d) => sum + d.amount, 0)
        
        if (campaign.raisedAmount !== raisedAmount) {
          await tx.campaign.update({
            where: { id: campaign.id },
            data: { raisedAmount }
          })
          updatedCampaigns++
        }
      }
      
      // Update event attendee counts
      const events = await tx.event.findMany()
      let updatedEvents = 0
      
      for (const event of events) {
        const attendances = await tx.eventAttendance.findMany({
          where: { eventId: event.id }
        })
        
        const attendees = attendances.filter(a => a.attended).length
        
        if (event.attendees !== attendees) {
          await tx.event.update({
            where: { id: event.id },
            data: { attendees }
          })
          updatedEvents++
        }
      }
      
      return {
        updatedDonors,
        updatedCampaigns,
        updatedEvents,
        totalDonors: donors.length,
        totalCampaigns: campaigns.length,
        totalEvents: events.length
      }
    })
    
    console.log('Data recalculation completed:', result)
    return NextResponse.json({
      success: true,
      message: 'Data recalculation completed successfully',
      ...result
    })
    
  } catch (error) {
    console.error('Error recalculating data:', error)
    return NextResponse.json({ 
      error: 'Failed to recalculate data',
      details: error.message 
    }, { status: 500 })
  }
}