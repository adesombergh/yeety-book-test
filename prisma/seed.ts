import { daysOfWeek, OpeningHours } from '@/lib/types/restaurant'
import { PrismaClient, ReservationStatus } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

// Helper function to generate realistic customer data
function generateCustomerData() {
  const firstNames = [
    'Emma',
    'Liam',
    'Olivia',
    'Noah',
    'Ava',
    'Ethan',
    'Sophia',
    'Mason',
    'Isabella',
    'William',
    'Charlotte',
    'James',
    'Amelia',
    'Benjamin',
    'Mia',
    'Lucas',
    'Harper',
    'Henry',
    'Evelyn',
    'Alexander',
    'Abigail',
    'Michael',
    'Emily',
    'Daniel',
    'Elizabeth',
    'Matthew',
    'Sofia',
    'Jackson',
    'Avery',
    'Sebastian',
    'Ella',
    'David',
    'Scarlett',
    'Carter',
    'Grace',
    'Wyatt',
    'Chloe',
    'Jayden',
    'Victoria',
    'John',
    'Riley',
    'Owen',
    'Aria',
    'Dylan',
    'Zoe',
    'Luke',
    'Lily',
    'Gabriel',
    'Nora',
    'Anthony',
  ]

  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
    'Perez',
    'Thompson',
    'White',
    'Harris',
    'Sanchez',
    'Clark',
    'Ramirez',
    'Lewis',
    'Robinson',
    'Walker',
    'Young',
    'Allen',
    'King',
    'Wright',
    'Scott',
    'Torres',
    'Nguyen',
    'Hill',
    'Flores',
    'Green',
    'Adams',
    'Nelson',
    'Baker',
    'Hall',
    'Rivera',
    'Campbell',
    'Mitchell',
    'Carter',
    'Roberts',
  ]

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${
      Math.floor(Math.random() * 9000) + 1000
    }`,
  }
}

// Helper function to generate reservation time within opening hours
function generateReservationTime(
  date: Date,
  openingHours: OpeningHours,
  slotInterval: number
) {
  const dayOfWeek = daysOfWeek[date.getDay()]
  const daySchedule = openingHours[dayOfWeek]

  if (daySchedule.closed || daySchedule.periods.length === 0) {
    return null
  }

  // Pick a random period from available periods
  const randomPeriod =
    daySchedule.periods[Math.floor(Math.random() * daySchedule.periods.length)]

  const [openHour, openMinute] = randomPeriod.open.split(':').map(Number)
  const [closeHour, closeMinute] = randomPeriod.close.split(':').map(Number)

  // Calculate available time slots within this period
  const openTime = openHour * 60 + openMinute
  const closeTime =
    closeHour * 60 + closeMinute + (closeHour === 0 ? 24 * 60 : 0) // Handle midnight

  // Generate random slot within this service period
  const availableSlots = Math.floor((closeTime - openTime) / slotInterval)
  if (availableSlots <= 0) return null

  const randomSlot = Math.floor(Math.random() * availableSlots)
  const reservationTime = openTime + randomSlot * slotInterval

  const hour = Math.floor(reservationTime / 60) % 24
  const minute = reservationTime % 60

  const reservationDate = new Date(date)
  reservationDate.setHours(hour, minute, 0, 0)

  return reservationDate
}

// Helper function to generate random notes
function getRandomNote(): string {
  const notes = [
    'Anniversary dinner',
    'Birthday celebration',
    'Business meeting',
    'Date night',
    'Family gathering',
    'Allergic to shellfish',
    'Vegetarian options needed',
    'Window table preferred',
    'Quiet table please',
    'First time visiting',
    'Special occasion',
    'Celebrating promotion',
    'Gluten-free options needed',
    'High chair needed',
    'Running late - please hold table',
    'Surprise party setup',
    'Wine pairing requested',
    "Chef's table if available",
    'Outdoor seating preferred',
    'Group celebration',
  ]

  return notes[Math.floor(Math.random() * notes.length)]
}

// Helper function to get random reservation status based on date
function getReservationStatus(date: Date): ReservationStatus {
  const now = new Date()
  const daysDiff = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysDiff < -1) {
    // Past reservations - mostly completed, some cancelled
    return Math.random() < 0.8 ? 'COMPLETED' : 'CANCELLED'
  } else if (daysDiff < 0) {
    // Yesterday - mix of completed and cancelled
    return Math.random() < 0.7 ? 'COMPLETED' : 'CANCELLED'
  } else if (daysDiff <= 7) {
    // This week - mostly confirmed, some pending, few cancelled
    const rand = Math.random()
    if (rand < 0.6) return 'CONFIRMED'
    if (rand < 0.85) return 'PENDING'
    return 'CANCELLED'
  } else {
    // Future - mostly confirmed and pending
    return Math.random() < 0.7 ? 'CONFIRMED' : 'PENDING'
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  // Check if users already exist
  const existingUserCount = await prisma.user.count()
  console.log(`Found ${existingUserCount} existing users`)

  if (existingUserCount > 0) {
    console.log('🧹 Clearing existing users...')
    await prisma.user.deleteMany({})
  }

  console.log('👤 Creating users...')

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      clerkId: 'user_32ZGKoTscBA26GgPABlCCsoAVZx',
      email: 'aldebaran.desombergh@gmail.com',
      isAdmin: true,
    },
  })

  // Create second admin user
  const adminUser2 = await prisma.user.create({
    data: {
      clerkId: 'user_32v3G6xviIb49M3QKXj3SkK89JE',
      email: 'yahia.vlemmings@yeety.be',
      isAdmin: true,
    },
  })

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      clerkId: 'user_32p9CgFG9e6XmK4CXA9R5R4JHuV',
      email: 'aldebaran.desombergh@yeety.be',
      isAdmin: false,
    },
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)
  console.log(`✅ Created admin user: ${adminUser2.email}`)
  console.log(`✅ Created test user: ${testUser.email}`)

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
        vatNumber: 'BE0123456789',
        emailContact: 'reservations@bellavista.com',
        phoneContact: '+1-555-0123',
        openingHours: {
          monday: {
            closed: false,
            periods: [{ open: '17:00', close: '22:00' }],
          },
          tuesday: {
            closed: false,
            periods: [{ open: '17:00', close: '22:00' }],
          },
          wednesday: {
            closed: false,
            periods: [{ open: '17:00', close: '22:00' }],
          },
          thursday: {
            closed: false,
            periods: [{ open: '17:00', close: '22:00' }],
          },
          friday: {
            closed: false,
            periods: [{ open: '17:00', close: '23:00' }],
          },
          saturday: {
            closed: false,
            periods: [
              { open: '12:00', close: '14:30' },
              { open: '18:00', close: '23:00' },
            ],
          },
          sunday: {
            closed: false,
            periods: [{ open: '12:00', close: '21:00' }],
          },
        },
        slotInterval: 30,
        minGuestsPerReservation: 1,
        maxGuestsPerReservation: 8,
        maxReservationsPerSlot: 3,
        reservationLeadTimeMinHours: 1, // 1 hour minimum
        reservationLeadTimeMaxHours: 168, // 168 hours maximum (7 days / 1 week)
        subscriptionStatus: 'active',
      },
      {
        slug: 'le-petit-bistro',
        name: 'Le Petit Bistro',
        vatNumber: 'FR12345678901',
        emailContact: 'contact@lepetitbistro.fr',
        phoneContact: '+33-1-42-86-87-88',
        openingHours: {
          monday: { closed: true, periods: [] },
          tuesday: {
            closed: false,
            periods: [
              { open: '12:00', close: '14:30' },
              { open: '19:00', close: '22:30' },
            ],
          },
          wednesday: {
            closed: false,
            periods: [
              { open: '12:00', close: '14:30' },
              { open: '19:00', close: '22:30' },
            ],
          },
          thursday: {
            closed: false,
            periods: [
              { open: '12:00', close: '14:30' },
              { open: '19:00', close: '22:30' },
            ],
          },
          friday: {
            closed: false,
            periods: [
              { open: '12:00', close: '14:30' },
              { open: '19:00', close: '23:00' },
            ],
          },
          saturday: {
            closed: false,
            periods: [
              { open: '12:00', close: '14:30' },
              { open: '18:30', close: '23:00' },
            ],
          },
          sunday: {
            closed: false,
            periods: [{ open: '12:00', close: '21:00' }],
          },
        },
        slotInterval: 60,
        minGuestsPerReservation: 2,
        maxGuestsPerReservation: 6,
        maxReservationsPerSlot: 2,
        reservationLeadTimeMinHours: 2, // 2 hours minimum
        reservationLeadTimeMaxHours: 336, // 336 hours maximum (14 days / 2 weeks)
        subscriptionStatus: 'active',
      },
      {
        slug: 'sakura-sushi',
        name: 'Sakura Sushi',
        vatNumber: 'JP123456789012',
        emailContact: 'info@sakurasushi.jp',
        phoneContact: '+81-3-1234-5678',
        openingHours: {
          monday: {
            closed: false,
            periods: [{ open: '18:00', close: '23:00' }],
          },
          tuesday: {
            closed: false,
            periods: [{ open: '18:00', close: '23:00' }],
          },
          wednesday: {
            closed: false,
            periods: [{ open: '18:00', close: '23:00' }],
          },
          thursday: {
            closed: false,
            periods: [{ open: '18:00', close: '23:00' }],
          },
          friday: {
            closed: false,
            periods: [{ open: '18:00', close: '00:00' }],
          },
          saturday: {
            closed: false,
            periods: [{ open: '17:00', close: '00:00' }],
          },
          sunday: { closed: true, periods: [] },
        },
        slotInterval: 45,
        minGuestsPerReservation: 1,
        maxGuestsPerReservation: 10,
        maxReservationsPerSlot: 4,
        reservationLeadTimeMinHours: 1, // 1 hour minimum
        reservationLeadTimeMaxHours: 72, // 72 hours maximum (3 days)
        subscriptionStatus: 'active',
      },
      {
        slug: 'mountain-grill',
        name: 'Mountain Grill',
        vatNumber: 'BE9876543210',
        emailContact: 'bookings@mountaingrill.com',
        phoneContact: null, // Testing optional phone contact
        openingHours: {
          monday: { closed: true, periods: [] },
          tuesday: { closed: true, periods: [] },
          wednesday: {
            closed: false,
            periods: [{ open: '16:00', close: '21:00' }],
          },
          thursday: {
            closed: false,
            periods: [{ open: '16:00', close: '21:00' }],
          },
          friday: {
            closed: false,
            periods: [{ open: '16:00', close: '22:00' }],
          },
          saturday: {
            closed: false,
            periods: [{ open: '12:00', close: '22:00' }],
          },
          sunday: {
            closed: false,
            periods: [{ open: '12:00', close: '20:00' }],
          },
        },
        slotInterval: 90,
        minGuestsPerReservation: 2,
        maxGuestsPerReservation: 12,
        maxReservationsPerSlot: 1,
        reservationLeadTimeMinHours: 24, // 24 hours minimum (1 day)
        reservationLeadTimeMaxHours: 300, // 300 hours maximum (~12.5 days)
        subscriptionStatus: 'inactive',
      },
    ],
  })

  console.log(`✅ Created ${restaurants.count} restaurants`)

  // Connect test user to the first restaurant as owner
  const firstRestaurant = await prisma.restaurant.findFirst({
    orderBy: { id: 'asc' },
  })

  if (firstRestaurant) {
    await prisma.restaurant.update({
      where: { id: firstRestaurant.id },
      data: {
        owners: {
          connect: { id: testUser.id },
        },
      },
    })
    console.log(`✅ Connected test user to restaurant: ${firstRestaurant.name}`)
  }

  // Fetch the created restaurants to get their IDs
  console.log('📅 Creating mock reservations...')
  const createdRestaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      openingHours: true,
      slotInterval: true,
      minGuestsPerReservation: true,
      maxGuestsPerReservation: true,
    },
  })

  // Generate reservations for each restaurant
  const reservationsToCreate = []
  const now = new Date()

  for (const restaurant of createdRestaurants) {
    console.log(`  Creating reservations for ${restaurant.name}...`)

    // Focus on current week and nearby days for immediate visibility
    for (let dayOffset = -3; dayOffset <= 10; dayOffset++) {
      const date = new Date(now)
      date.setDate(now.getDate() + dayOffset)

      // Generate more reservations for current week (2-6 per day)
      let reservationsPerDay
      if (dayOffset >= 0 && dayOffset <= 7) {
        // Current week - more reservations
        reservationsPerDay = Math.floor(Math.random() * 5) + 2
      } else {
        // Past few days and next few days - fewer reservations
        reservationsPerDay = Math.floor(Math.random() * 3) + 1
      }

      for (let i = 0; i < reservationsPerDay; i++) {
        const reservationTime = generateReservationTime(
          date,
          restaurant.openingHours as unknown as OpeningHours,
          restaurant.slotInterval
        )

        if (reservationTime) {
          const customer = generateCustomerData()
          const status = getReservationStatus(reservationTime)
          const guests =
            Math.floor(
              Math.random() *
                (restaurant.maxGuestsPerReservation -
                  restaurant.minGuestsPerReservation +
                  1)
            ) + restaurant.minGuestsPerReservation

          // Generate cancel token for cancelled reservations
          const cancelToken =
            status === 'CANCELLED' ? randomBytes(32).toString('hex') : null

          // Add some notes occasionally
          const notes = Math.random() < 0.3 ? getRandomNote() : null

          reservationsToCreate.push({
            restaurantId: restaurant.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            date: reservationTime,
            guests,
            notes,
            status,
            cancelToken,
            cancelledAt: status === 'CANCELLED' ? new Date() : null,
          })
        }
      }
    }
  }

  // Create all reservations
  if (reservationsToCreate.length > 0) {
    await prisma.reservation.createMany({
      data: reservationsToCreate,
    })
    console.log(`✅ Created ${reservationsToCreate.length} reservations`)
  }

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
