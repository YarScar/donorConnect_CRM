const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.eventAttendance.deleteMany()
  await prisma.followUp.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.event.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.donor.deleteMany()

  // Create sample donors
  const donor1 = await prisma.donor.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '555-0101',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
      donorType: 'Individual',
      preferredContact: 'Email',
      totalDonated: 750,
      lastDonation: new Date('2024-11-01'),
      isActive: true,
      tags: 'recurring,email-preferred',
      notes: 'Regular donor, prefers email contact'
    }
  })

  const donor2 = await prisma.donor.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      phone: '555-0102',
      address: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      country: 'USA',
      donorType: 'Individual',
      preferredContact: 'Phone',
      totalDonated: 1000,
      lastDonation: new Date('2024-06-20'),
      isActive: true,
      tags: 'major-donor'
    }
  })

  const donor3 = await prisma.donor.create({
    data: {
      firstName: 'ABC',
      lastName: 'Foundation',
      email: 'contact@abcfoundation.org',
      phone: '555-0103',
      address: '789 Corporate Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      donorType: 'Foundation',
      preferredContact: 'Email',
      totalDonated: 5000,
      lastDonation: new Date('2024-10-15'),
      isActive: true,
      tags: 'foundation,major-donor',
      notes: 'Large annual contributor'
    }
  })

  // Create sample campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Annual Fund 2024',
      description: 'General operating support for 2024',
      goalAmount: 50000,
      raisedAmount: 1500,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'Active',
      campaignType: 'General'
    }
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Building Renovation',
      description: 'Funds for facility improvements',
      goalAmount: 100000,
      raisedAmount: 250,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-06-01'),
      status: 'Active',
      campaignType: 'Capital'
    }
  })

  // Create sample event
  const event1 = await prisma.event.create({
    data: {
      name: 'Charity Gala 2024',
      description: 'Annual fundraising gala dinner',
      eventDate: new Date('2024-10-15'),
      location: 'Grand Hotel Ballroom',
      capacity: 200,
      attendees: 150,
      ticketPrice: 100,
      status: 'Completed',
      eventType: 'Fundraising'
    }
  })

  // Create event attendance records
  await prisma.eventAttendance.create({
    data: {
      eventId: event1.id,
      donorId: donor3.id,
      attended: true
    }
  })

  // Create sample donations
  await prisma.donation.create({
    data: {
      amount: 500,
      donationDate: new Date('2024-03-15'),
      paymentMethod: 'Credit Card',
      status: 'Completed',
      receiptSent: true,
      taxDeductible: true,
      donorId: donor1.id,
      campaignId: campaign1.id
    }
  })

  await prisma.donation.create({
    data: {
      amount: 1000,
      donationDate: new Date('2024-06-20'),
      paymentMethod: 'Check',
      status: 'Completed',
      receiptSent: true,
      taxDeductible: true,
      donorId: donor2.id,
      campaignId: campaign1.id
    }
  })

  await prisma.donation.create({
    data: {
      amount: 5000,
      donationDate: new Date('2024-10-15'),
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      receiptSent: true,
      taxDeductible: true,
      donorId: donor3.id,
      eventId: event1.id
    }
  })

  await prisma.donation.create({
    data: {
      amount: 250,
      donationDate: new Date('2024-11-01'),
      paymentMethod: 'Online',
      status: 'Completed',
      isRecurring: true,
      recurringType: 'Monthly',
      receiptSent: true,
      taxDeductible: true,
      donorId: donor1.id,
      campaignId: campaign2.id
    }
  })

  // Create sample follow-ups
  await prisma.followUp.create({
    data: {
      title: 'Thank you call for October donation',
      description: 'Call to thank for gala attendance and donation',
      dueDate: new Date('2024-10-20'),
      status: 'Completed',
      priority: 'High',
      type: 'Thank You',
      assignedTo: 'Development Manager',
      completedAt: new Date('2024-10-19'),
      donorId: donor3.id
    }
  })

  await prisma.followUp.create({
    data: {
      title: 'Follow-up on building campaign',
      description: 'Discuss potential major gift for building renovation',
      dueDate: new Date('2024-12-15'),
      status: 'Pending',
      priority: 'High',
      type: 'Meeting',
      assignedTo: 'Executive Director',
      donorId: donor3.id
    }
  })

  await prisma.followUp.create({
    data: {
      title: 'Send year-end tax receipt',
      description: 'Email tax receipt for 2024 donations',
      dueDate: new Date('2025-01-15'),
      status: 'Pending',
      priority: 'Medium',
      type: 'Email',
      assignedTo: 'Development Coordinator',
      donorId: donor1.id
    }
  })

  // Create audit log entries
  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Donation',
      entityId: 1,
      newValues: JSON.stringify({ amount: 5000, donorId: donor3.id, eventId: event1.id })
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
