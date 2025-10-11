'use server'

import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import slugo from 'slugo'

export async function createRestaurant(name: string) {
  try {
    // Authenticate user
    const user = await currentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Restaurant name is required' }
    }

    if (name.length > 100) {
      return {
        success: false,
        error: 'Restaurant name must be less than 100 characters',
      }
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return { success: false, error: 'User not found' }
    }

    // Generate slug from name
    let slug = slugo(name)
    let slugSuffix = 0

    // Handle duplicate slugs by incrementing suffix
    while (await prisma.restaurant.findUnique({ where: { slug } })) {
      slugSuffix++
      slug = `${slugo(name)}-${slugSuffix}`
    }

    // Create restaurant with default values from Task 042 schema
    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        slug,
        owners: {
          connect: { id: dbUser.id },
        },
        // All other fields use defaults from schema:
        // - emailContact: null
        // - phoneContact: null
        // - openingHours: null
        // - slotInterval: 60
        // - minGuestsPerReservation: 1
        // - maxGuestsPerReservation: 6
        // - maxReservationsPerSlot: 1
        // - reservationLeadTimeMinHours: 60
        // - reservationLeadTimeMaxHours: 129600
        // - subscriptionStatus: "active"
      },
    })

    // Return success with restaurant ID for client-side redirect
    return {
      success: true,
      restaurantId: restaurant.id,
    }
  } catch (error) {
    console.error('Failed to create restaurant:', error)
    return {
      success: false,
      error: 'Failed to create restaurant. Please try again.',
    }
  }
}
