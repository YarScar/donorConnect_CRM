import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        donations: {
          include: {
            donor: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        attendances: {
          include: {
            donor: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        eventDate: 'desc'
      }
    })
    
    // Calculate event metrics
    const eventsWithMetrics = events.map(event => ({
      ...event,
      totalRaised: event.donations
        .filter(d => d.status === 'Completed')
        .reduce((sum, d) => sum + d.amount, 0),
      confirmedAttendees: event.attendances.filter(a => a.attended).length,
      registeredAttendees: event.attendances.length
    }))
    
    return NextResponse.json(eventsWithMetrics)
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
