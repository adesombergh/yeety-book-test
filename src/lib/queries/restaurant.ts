import prisma from '@/lib/prisma'
import {
  RestaurantQueryResult,
  RestaurantWithTypedHours,
  OpeningHours,
} from '@/lib/types/restaurant'

export async function getRestaurantBySlug(
  slug: string
): Promise<RestaurantQueryResult> {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: slug,
      },
    })

    if (!restaurant) {
      return {
        restaurant: null,
        error: 'Restaurant not found',
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
    console.error('Error fetching restaurant:', error)
    return {
      restaurant: null,
      error: 'Failed to fetch restaurant data',
    }
  }
}

export async function getAllRestaurants(): Promise<{
  restaurants: RestaurantWithTypedHours[]
  error: string | null
}> {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: 20,
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
    console.error('Error fetching restaurants:', error)
    return {
      restaurants: [],
      error: 'Failed to fetch restaurants data',
    }
  }
}
