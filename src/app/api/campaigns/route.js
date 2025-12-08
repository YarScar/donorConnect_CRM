import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        donations: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

// POST create new campaign
export async function POST(request) {
  try {
    const data = await request.json()
    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
