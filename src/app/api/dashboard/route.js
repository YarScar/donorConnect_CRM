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

    // Get donations for last 12 months and aggregate by month (YYYY-MM)
    const oneYearAgo = new Date()
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 12)

    const lastYearDonations = await prisma.donation.findMany({
      where: {
        donationDate: {
          gte: oneYearAgo
        }
      },
      select: {
        amount: true,
        donationDate: true
      },
      orderBy: { donationDate: 'asc' }
    })

    const monthlyAggregates = {}
    lastYearDonations.forEach(d => {
      const month = d.donationDate.toISOString().substr(0, 7) // YYYY-MM
      monthlyAggregates[month] = (monthlyAggregates[month] || 0) + (d.amount || 0)
    })

    const donationTrendsMonthly = Object.keys(monthlyAggregates).sort().map(month => ({ month, amount: monthlyAggregates[month] }))

    // If there are no donations in the last 12 months (e.g., seeded data older than 12 months),
    // fall back to aggregating across all donations so charts reflect existing DB totals.
    if (donationTrendsMonthly.length === 0) {
      const allDonations = await prisma.donation.findMany({ select: { amount: true, donationDate: true }, orderBy: { donationDate: 'asc' } })
      const allMonthly = {}
      allDonations.forEach(d => {
        const month = d.donationDate.toISOString().substr(0, 7)
        allMonthly[month] = (allMonthly[month] || 0) + (d.amount || 0)
      })
      // overwrite donationTrendsMonthly with full-range aggregates
      Object.keys(allMonthly).sort()
      // convert to array
      const fallback = Object.keys(allMonthly).sort().map(month => ({ month, amount: allMonthly[month] }))
      // assign to donationTrendsMonthly variable used below
      // (we can't reassign const, so build a new variable name and use that in the return)
      var donationTrendsMonthlyFallback = fallback
    }

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

    // Get donor growth (last 12 months) and aggregate by month
    const donorOneYearAgo = new Date()
    donorOneYearAgo.setMonth(donorOneYearAgo.getMonth() - 12)

    const donorsLastYear = await prisma.donor.findMany({
      where: {
        createdAt: {
          gte: donorOneYearAgo
        }
      },
      select: { createdAt: true }
    })

    const monthlyGrowth = {}
    donorsLastYear.forEach(d => {
      const month = d.createdAt.toISOString().substr(0, 7)
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1
    })

    // Aggregate donations by year for multi-year views
    const donationsAll = await prisma.donation.findMany({ select: { amount: true, donationDate: true }, orderBy: { donationDate: 'asc' } })
    const yearAggregates = {}
    donationsAll.forEach(d => {
      const year = d.donationDate.getFullYear()
      yearAggregates[year] = (yearAggregates[year] || 0) + (d.amount || 0)
    })
    const donationTrendsYearly = Object.keys(yearAggregates).sort().map(y => ({ year: Number(y), amount: yearAggregates[y] }))

    logger.info('Dashboard snapshot', {
      totalDonors,
      totalDonations,
      totalCampaigns,
      totalEvents,
      recentDonations: recentDonations.length,
      topDonorsCount: donorsWithTotals.length
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
      // raw recent donations (last 30 days), monthly aggregates for last 12 months, and donor growth by month
      donationTrends: monthlyDonations,
      donationTrendsMonthly: donationTrendsMonthly.length ? donationTrendsMonthly : (donationTrendsMonthlyFallback || []),
      donationTrendsYearly,
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