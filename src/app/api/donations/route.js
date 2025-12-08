import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all donations
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        donor: true,
        campaign: true,
        event: true
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
    const donation = await prisma.donation.create({
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
    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 })
  }
}
