import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        donations: true
      },
      orderBy: {
        eventDate: 'desc'
      }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST create new event
export async function POST(request) {
  try {
    const data = await request.json()
    const event = await prisma.event.create({
      data: {
        ...data,
        eventDate: new Date(data.eventDate)
      }
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
