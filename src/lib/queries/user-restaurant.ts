import prisma from '@/lib/prisma'
import { RestaurantWithTypedHours, OpeningHours } from '@/lib/types/restaurant'

// Result types for user-restaurant queries
export interface UserRestaurantsResult {
  restaurants: RestaurantWithTypedHours[]
  error: string | null
}

export interface UserRestaurantResult {
  restaurant: RestaurantWithTypedHours | null
  error: string | null
}

/**
 * Get all restaurants owned by a specific user, or all restaurants if user is admin
 * @param userId - The Clerk user ID
 * @returns Promise<UserRestaurantsResult>
 */
export async function getUserRestaurants(
  userId: string
): Promise<UserRestaurantsResult> {
  try {
    // Find the user first to check if they are admin
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        isAdmin: true,
      },
    })

    if (!user) {
      return {
        restaurants: [],
        error: 'User not found',
      }
    }

    // If user is admin, return all restaurants
    if (user.isAdmin) {
      return await getAllRestaurantsForAdmin()
    }

    // Otherwise, get user's owned restaurants
    const userWithRestaurants = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        restaurants: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    })

    if (!userWithRestaurants) {
      return {
        restaurants: [],
        error: 'User not found',
      }
    }

    // Cast restaurants with typed opening hours
    const typedRestaurants: RestaurantWithTypedHours[] =
      userWithRestaurants.restaurants.map((restaurant) => ({
        ...restaurant,
        openingHours: restaurant.openingHours as unknown as OpeningHours,
      }))

    return {
      restaurants: typedRestaurants,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching user restaurants:', error)
    return {
      restaurants: [],
      error: 'Failed to fetch user restaurants',
    }
  }
}

/**
 * Get a specific restaurant by slug for a user (checks ownership)
 * @param userId - The Clerk user ID
 * @param restaurantSlug - The restaurant slug
 * @returns Promise<UserRestaurantResult>
 */
export async function getUserRestaurantBySlug(
  userId: string,
  restaurantSlug: string
): Promise<UserRestaurantResult> {
  try {
    // Find the user first to check if they exist
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        isAdmin: true,
      },
    })

    if (!user) {
      return {
        restaurant: null,
        error: 'User not found',
      }
    }

    // Find the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: restaurantSlug,
      },
      include: {
        owners: {
          select: {
            clerkId: true,
          },
        },
      },
    })

    if (!restaurant) {
      return {
        restaurant: null,
        error: 'Restaurant not found',
      }
    }

    // Check if user has access (is owner or admin)
    const isOwner = restaurant.owners.some((owner) => owner.clerkId === userId)

    if (!isOwner && !user.isAdmin) {
      return {
        restaurant: null,
        error: 'Access denied: You do not own this restaurant',
      }
    }

    // Cast the restaurant with typed opening hours
    const typedRestaurant: RestaurantWithTypedHours = {
      ...restaurant,
      openingHours: restaurant.openingHours as unknown as OpeningHours,
    }

    return {
      restaurant: typedRestaurant,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching user restaurant by slug:', error)
    return {
      restaurant: null,
      error: 'Failed to fetch restaurant data',
    }
  }
}

/**
 * Get all restaurants in the system (admin only)
 * @returns Promise<UserRestaurantsResult>
 */
export async function getAllRestaurantsForAdmin(): Promise<UserRestaurantsResult> {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Cast all restaurants with typed opening hours
    const typedRestaurants: RestaurantWithTypedHours[] = restaurants.map(
      (restaurant) => ({
        ...restaurant,
        openingHours: restaurant.openingHours as unknown as OpeningHours,
      })
    )

    return {
      restaurants: typedRestaurants,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching all restaurants for admin:', error)
    return {
      restaurants: [],
      error: 'Failed to fetch restaurants data',
    }
  }
}
