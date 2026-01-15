import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    return NextResponse.json({ error: 'Failed to fetch donor' }, { status: 500 })
  }
}

// PUT update donor
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    
    console.log('Updating donor with ID:', params.id, 'Data:', data)
    
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
    
    console.log('Successfully updated donor:', donor.id)
    return NextResponse.json(donor)
  } catch (error) {
    console.error('Error updating donor:', error)
    return NextResponse.json({ 
      error: 'Failed to update donor', 
      details: error.message 
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
