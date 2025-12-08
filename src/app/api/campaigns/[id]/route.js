import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single campaign
export async function GET(request, { params }) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        donations: {
          include: {
            donor: true
          }
        }
      }
    })
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    
    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
  }
}

// PUT update campaign
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const campaign = await prisma.campaign.update({
      where: { id: parseInt(params.id) },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })
    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
  }
}

// DELETE campaign
export async function DELETE(request, { params }) {
  try {
    await prisma.campaign.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}
