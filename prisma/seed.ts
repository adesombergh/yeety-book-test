import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if restaurants already exist
  const existingCount = await prisma.restaurant.count()
  console.log(`Found ${existingCount} existing restaurants`)

  if (existingCount > 0) {
    console.log('🧹 Clearing existing restaurants...')
    await prisma.restaurant.deleteMany({})
  }

  console.log('📝 Creating mock restaurants...')

  // Create mock restaurants
  const restaurants = await prisma.restaurant.createMany({
    data: [
      {
        slug: 'bella-vista',
        name: 'Bella Vista',
        emailContact: 'reservations@bellavista.com',
        phoneContact: '+1-555-0123',
        openingHours: {
          monday: { open: '17:00', close: '22:00', closed: false },
          tuesday: { open: '17:00', close: '22:00', closed: false },
          wednesday: { open: '17:00', close: '22:00', closed: false },
          thursday: { open: '17:00', close: '22:00', closed: false },
          friday: { open: '17:00', close: '23:00', closed: false },
          saturday: { open: '12:00', close: '23:00', closed: false },
          sunday: { open: '12:00', close: '21:00', closed: false }
        },
        slotInterval: 30,
        minGuestsPerReservation: 1,
        maxGuestsPerReservation: 8,
        maxReservationsPerSlot: 3,
        reservationLeadTimeMin: 60, // 1 hour minimum
        reservationLeadTimeMax: 10080, // 1 week maximum (in minutes)
        subscriptionStatus: 'active'
      },
      {
        slug: 'le-petit-bistro',
        name: 'Le Petit Bistro',
        emailContact: 'contact@lepetitbistro.fr',
        phoneContact: '+33-1-42-86-87-88',
        openingHours: {
          monday: { closed: true },
          tuesday: { open: '12:00', close: '14:30', closed: false },
          wednesday: { open: '12:00', close: '14:30', closed: false },
          thursday: { open: '12:00', close: '14:30', closed: false },
          friday: { open: '12:00', close: '14:30', closed: false },
          saturday: { open: '12:00', close: '22:00', closed: false },
          sunday: { open: '12:00', close: '21:00', closed: false }
        },
        slotInterval: 60,
        minGuestsPerReservation: 2,
        maxGuestsPerReservation: 6,
        maxReservationsPerSlot: 2,
        reservationLeadTimeMin: 120, // 2 hours minimum
        reservationLeadTimeMax: 20160, // 2 weeks maximum (in minutes)
        subscriptionStatus: 'active'
      },
      {
        slug: 'sakura-sushi',
        name: 'Sakura Sushi',
        emailContact: 'info@sakurasushi.jp',
        phoneContact: '+81-3-1234-5678',
        openingHours: {
          monday: { open: '18:00', close: '23:00', closed: false },
          tuesday: { open: '18:00', close: '23:00', closed: false },
          wednesday: { open: '18:00', close: '23:00', closed: false },
          thursday: { open: '18:00', close: '23:00', closed: false },
          friday: { open: '18:00', close: '00:00', closed: false },
          saturday: { open: '17:00', close: '00:00', closed: false },
          sunday: { closed: true }
        },
        slotInterval: 45,
        minGuestsPerReservation: 1,
        maxGuestsPerReservation: 10,
        maxReservationsPerSlot: 4,
        reservationLeadTimeMin: 30, // 30 minutes minimum
        reservationLeadTimeMax: 4320, // 3 days maximum (in minutes)
        subscriptionStatus: 'active'
      },
      {
        slug: 'mountain-grill',
        name: 'Mountain Grill',
        emailContact: 'bookings@mountaingrill.com',
        phoneContact: null, // Testing optional phone contact
        openingHours: {
          monday: { closed: true },
          tuesday: { closed: true },
          wednesday: { open: '16:00', close: '21:00', closed: false },
          thursday: { open: '16:00', close: '21:00', closed: false },
          friday: { open: '16:00', close: '22:00', closed: false },
          saturday: { open: '12:00', close: '22:00', closed: false },
          sunday: { open: '12:00', close: '20:00', closed: false }
        },
        slotInterval: 90,
        minGuestsPerReservation: 2,
        maxGuestsPerReservation: 12,
        maxReservationsPerSlot: 1,
        reservationLeadTimeMin: 240, // 4 hours minimum
        reservationLeadTimeMax: 43200, // 1 month maximum (in minutes)
        subscriptionStatus: 'inactive'
      }
    ]
  })

  console.log(`✅ Created ${restaurants.count} restaurants`)
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
