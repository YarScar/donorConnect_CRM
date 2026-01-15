import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all follow-ups
export async function GET() {
  try {
    const followUps = await prisma.followUp.findMany({
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            donorType: true,
            totalDonated: true,
            lastDonation: true
          }
        }
      },
      orderBy: [
        {
          status: 'asc' // Pending items first
        },
        {
          dueDate: 'asc' // Then by due date
        }
      ]
    })
    return NextResponse.json(followUps)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 })
  }
}

// POST create new follow-up
export async function POST(request) {
  try {
    const data = await request.json()
    const followUp = await prisma.followUp.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        completedAt: data.completedAt ? new Date(data.completedAt) : null
      },
      include: {
        donor: true
      }
    })
    return NextResponse.json(followUp, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create follow-up' }, { status: 500 })
  }
}
