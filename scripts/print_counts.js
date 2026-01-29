const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    const totalDonors = await prisma.donor.count()
    const totalDonations = await prisma.donation.count()
    const totalCampaigns = await prisma.campaign.count()
    const totalEvents = await prisma.event.count()

    console.log('DATABASE SNAPSHOT')
    console.log('Total donors:', totalDonors)
    console.log('Total donations:', totalDonations)
    console.log('Total campaigns:', totalCampaigns)
    console.log('Total events:', totalEvents)
  } catch (e) {
    console.error('Error connecting to database:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
