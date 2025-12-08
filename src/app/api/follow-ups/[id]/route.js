import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single follow-up
export async function GET(request, { params }) {
  try {
    const followUp = await prisma.followUp.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        donor: true
      }
    })
    
    if (!followUp) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 })
    }
    
    return NextResponse.json(followUp)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch follow-up' }, { status: 500 })
  }
}

// PUT update follow-up
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const followUp = await prisma.followUp.update({
      where: { id: parseInt(params.id) },
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        completedAt: data.completedAt ? new Date(data.completedAt) : null
      },
      include: {
        donor: true
      }
    })
    return NextResponse.json(followUp)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update follow-up' }, { status: 500 })
  }
}

// DELETE follow-up
export async function DELETE(request, { params }) {
  try {
    await prisma.followUp.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'Follow-up deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete follow-up' }, { status: 500 })
  }
}
