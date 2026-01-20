import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    // Get counts
    const totalDonors = await prisma.donor.count()
    const totalDonations = await prisma.donation.count()
    const totalCampaigns = await prisma.campaign.count()
    const totalEvents = await prisma.event.count()

    // Get donation statistics
    const donationStats = await prisma.donation.aggregate({
      _sum: { amount: true },
      _avg: { amount: true },
    })

    // Get recent donations
    const recentDonations = await prisma.donation.findMany({
      take: 5,
      orderBy: { donationDate: 'desc' },
      include: {
        donor: {
          select: { firstName: true, lastName: true, email: true }
        },
        campaign: {
          select: { name: true }
        }
      }
    })

    // Get donation trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const monthlyDonations = await prisma.donation.findMany({
      where: {
        donationDate: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        amount: true,
        donationDate: true
      },
      orderBy: { donationDate: 'asc' }
    })

    // Get top donors
    const topDonors = await prisma.donor.findMany({
      include: {
        donations: {
          select: { amount: true }
        }
      }
    })

    // Calculate total donations per donor and sort
    const donorsWithTotals = topDonors.map(donor => ({
      id: donor.id,
      firstName: donor.firstName,
      lastName: donor.lastName,
      email: donor.email,
      totalDonated: donor.donations.reduce((sum, donation) => sum + donation.amount, 0),
      donationCount: donor.donations.length
    })).sort((a, b) => b.totalDonated - a.totalDonated).slice(0, 5)

    // Get campaign performance
    const campaignPerformance = await prisma.campaign.findMany({
      include: {
        donations: {
          select: { amount: true }
        }
      }
    })

    const campaignsWithStats = campaignPerformance.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      goalAmount: campaign.goalAmount || 0,
      raised: campaign.donations.reduce((sum, donation) => sum + donation.amount, 0),
      donorCount: campaign.donations.length,
      status: campaign.status
    }))

    // Get donor growth (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const donorGrowth = await prisma.donor.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: true,
    })

    // Process donor growth data by month
    const monthlyGrowth = {}
    donorGrowth.forEach(item => {
      const month = item.createdAt.toISOString().substr(0, 7) // YYYY-MM format
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + item._count
    })

    return NextResponse.json({
      summary: {
        totalDonors,
        totalDonations,
        totalCampaigns,
        totalEvents,
        totalAmount: donationStats._sum.amount || 0,
        averageGift: donationStats._avg.amount || 0
      },
      recentDonations,
      topDonors: donorsWithTotals,
      campaignPerformance: campaignsWithStats,
      donationTrends: monthlyDonations,
      donorGrowth: Object.entries(monthlyGrowth).map(([month, count]) => ({
        month,
        count
      }))
    })
  } catch (error) {
    logger.error('Dashboard API Error', { error: error.message, stack: error.stack })
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}