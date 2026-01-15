import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all donors
export async function GET() {
  try {
    console.log('Fetching all donors...')
    
    const donors = await prisma.donor.findMany({
      include: {
        donations: {
          include: {
            campaign: true,
            event: true
          }
        },
        followUps: true,
        eventAttendances: {
          include: {
            event: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`Successfully fetched ${donors.length} donors`)
    return NextResponse.json(donors)
  } catch (error) {
    console.error('Error fetching donors:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch donors', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST create new donor
export async function POST(request) {
  try {
    const data = await request.json()
    
    console.log('Creating donor with data:', data)
    
    // Ensure required fields and set defaults for new schema fields
    const donorData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zipCode: data.zipCode || null,
      country: data.country || 'USA',
      donorType: data.donorType || 'Individual',
      preferredContact: data.preferredContact || 'Email',
      totalDonated: 0, // Initialize to 0
      lastDonation: null, // Initialize to null
      isActive: data.isActive !== undefined ? data.isActive : true,
      tags: data.tags || null,
      notes: data.notes || null
    }
    
    const donor = await prisma.donor.create({
      data: donorData,
      include: {
        donations: true,
        followUps: true,
        eventAttendances: {
          include: {
            event: true
          }
        }
      }
    })
    
    console.log('Successfully created donor:', donor.id)
    return NextResponse.json(donor, { status: 201 })
  } catch (error) {
    console.error('Error creating donor:', error)
    return NextResponse.json({ 
      error: 'Failed to create donor', 
      details: error.message 
    }, { status: 500 })
  }
}
