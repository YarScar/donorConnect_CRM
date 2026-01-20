import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET all donors
export async function GET() {
  try {
    logger.info('Fetching all donors')
    
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
    
    logger.info('Successfully fetched donors', { count: donors.length })
    return NextResponse.json(donors)
  } catch (error) {
    logger.error('Error fetching donors', { error: error.message, stack: error.stack })
    return NextResponse.json({ 
      error: 'Failed to fetch donors'
    }, { status: 500 })
  }
}

// POST create new donor
export async function POST(request) {
  try {
    const data = await request.json()
    
    logger.info('Creating donor', { email: data.email })
    
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
    
    logger.info('Successfully created donor', { donorId: donor.id })
    return NextResponse.json(donor, { status: 201 })
  } catch (error) {
    logger.error('Error creating donor', { error: error.message, stack: error.stack })
    return NextResponse.json({ 
      error: 'Failed to create donor'
    }, { status: 500 })
  }
}
