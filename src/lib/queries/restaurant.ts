import prisma from '@/lib/prisma';
import { RestaurantQueryResult, RestaurantWithTypedHours, OpeningHours } from '@/lib/types/restaurant';

export async function getRestaurantBySlug(slug: string): Promise<RestaurantQueryResult> {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!restaurant) {
      return {
        restaurant: null,
        error: 'Restaurant not found',
      };
    }

    // Cast the restaurant with typed opening hours
    const typedRestaurant: RestaurantWithTypedHours = {
      ...restaurant,
      openingHours: restaurant.openingHours as unknown as OpeningHours,
    };

    return {
      restaurant: typedRestaurant,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return {
      restaurant: null,
      error: 'Failed to fetch restaurant data',
    };
  }
}
