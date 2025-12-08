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
    const donation = await prisma.donation.update({
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
    return NextResponse.json(donation)
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
