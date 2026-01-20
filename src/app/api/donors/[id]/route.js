import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET single donor
export async function GET(request, { params }) {
  try {
    const donor = await prisma.donor.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        donations: {
          orderBy: { donationDate: 'desc' }
        },
        followUps: {
          orderBy: { dueDate: 'desc' }
        }
      }
    })
    
    if (!donor) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 })
    }
    
    return NextResponse.json(donor)
  } catch (error) {
    logger.error('Error fetching donor', { donorId: params.id, error: error.message })
    return NextResponse.json({ error: 'Failed to fetch donor' }, { status: 500 })
  }
}

// PUT update donor
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    
    logger.info('Updating donor', { donorId: params.id })
    
    // Filter out undefined values and handle new schema fields
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    )
    
    const donor = await prisma.donor.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        donations: {
          orderBy: { donationDate: 'desc' }
        },
        followUps: {
          orderBy: { dueDate: 'desc' }
        },
        eventAttendances: {
          include: {
            event: true
          }
        }
      }
    })
    
    logger.info('Successfully updated donor', { donorId: donor.id })
    return NextResponse.json(donor)
  } catch (error) {
    logger.error('Error updating donor', { donorId: params.id, error: error.message })
    return NextResponse.json({ 
      error: 'Failed to update donor'
    }, { status: 500 })
  }
}

// DELETE donor
export async function DELETE(request, { params }) {
  try {
    await prisma.donor.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'Donor deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete donor' }, { status: 500 })
  }
}
