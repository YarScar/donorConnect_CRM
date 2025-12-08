import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all donors
export async function GET() {
  try {
    const donors = await prisma.donor.findMany({
      include: {
        donations: true,
        followUps: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(donors)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donors' }, { status: 500 })
  }
}

// POST create new donor
export async function POST(request) {
  try {
    const data = await request.json()
    const donor = await prisma.donor.create({
      data
    })
    return NextResponse.json(donor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create donor' }, { status: 500 })
  }
}
