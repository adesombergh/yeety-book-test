import prisma from '@/lib/prisma'
import { Restaurant } from '@prisma/client'

export type RestaurantAccessResult =
  | { hasAccess: true; restaurant: Restaurant }
  | { hasAccess: false; error: 'NOT_FOUND' | 'FORBIDDEN' }

/**
 * Verifies if a user has access to a specific restaurant
 * @param clerkUserId - The Clerk user ID
 * @param restaurantId - The restaurant ID to check access for
 * @returns Promise<RestaurantAccessResult>
 */
export async function verifyRestaurantAccess(
  clerkUserId: string,
  restaurantId: string
): Promise<RestaurantAccessResult> {
  try {
    // Parse restaurant ID to integer
    const restaurantIdInt = parseInt(restaurantId, 10)
    if (isNaN(restaurantIdInt)) {
      return { hasAccess: false, error: 'NOT_FOUND' }
    }

    // Get the current user to check admin status
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { isAdmin: true },
    })

    // If user doesn't exist in our database, deny access
    if (!currentUser) {
      return { hasAccess: false, error: 'FORBIDDEN' }
    }

    // Find the restaurant with its owners
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantIdInt },
      include: {
        owners: {
          select: {
            clerkId: true,
            isAdmin: true,
          },
        },
      },
    })

    // Restaurant doesn't exist
    if (!restaurant) {
      return { hasAccess: false, error: 'NOT_FOUND' }
    }

    // Admin users can access all restaurants
    if (currentUser.isAdmin) {
      return { hasAccess: true, restaurant }
    }

    // Check if user is an owner of this restaurant
    const isOwner = restaurant.owners.some(
      (owner) => owner.clerkId === clerkUserId
    )

    if (!isOwner) {
      return { hasAccess: false, error: 'FORBIDDEN' }
    }

    return { hasAccess: true, restaurant }
  } catch (error) {
    console.error('Error verifying restaurant access:', error)
    return { hasAccess: false, error: 'FORBIDDEN' }
  }
}

/**
 * Extracts restaurant ID from dashboard routes
 * @param pathname - The request pathname
 * @returns string | null - The restaurant ID or null if not found
 */
export function extractRestaurantId(pathname: string): string | null {
  const dashboardRouteMatch = pathname.match(/^\/dashboard\/([^\/]+)/)
  return dashboardRouteMatch ? dashboardRouteMatch[1] : null
}

/**
 * Helper function for API routes to verify restaurant access
 * Returns appropriate Response objects for unauthorized access
 * @param clerkUserId - The Clerk user ID
 * @param restaurantId - The restaurant ID to check access for
 * @returns Promise<{ success: true; restaurant: Restaurant } | { success: false; response: Response }>
 */
export async function verifyRestaurantAccessForAPI(
  clerkUserId: string,
  restaurantId: string
): Promise<
  | { success: true; restaurant: Restaurant }
  | { success: false; response: Response }
> {
  const accessResult = await verifyRestaurantAccess(clerkUserId, restaurantId)

  if (!accessResult.hasAccess) {
    if (accessResult.error === 'NOT_FOUND') {
      return {
        success: false,
        response: Response.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        ),
      }
    } else {
      return {
        success: false,
        response: Response.json(
          { error: 'Forbidden: You do not have access to this restaurant' },
          { status: 403 }
        ),
      }
    }
  }

  return {
    success: true,
    restaurant: accessResult.restaurant,
  }
}
