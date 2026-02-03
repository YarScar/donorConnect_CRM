import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single event
export async function GET(request, { params }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        donations: {
          include: {
            donor: true
          }
        }
      }
    })
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

// PUT update event
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const event = await prisma.event.update({
      where: { id: parseInt(params.id) },
      data: {
        ...data,
        eventDate: new Date(data.eventDate)
      }
    })
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE event
export async function DELETE(request, { params }) {
  try {
    await prisma.event.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
