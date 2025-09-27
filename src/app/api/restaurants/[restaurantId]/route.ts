import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { createRestaurantSettingsSchema } from '@/lib/schemas/restaurant-settings'
import { verifyRestaurantAccess } from '@/lib/auth/restaurant-access'
import { getLocaleFromHeaders } from '@/lib/utils/locale'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { restaurantId } = await params
    const restaurantIdNum = parseInt(restaurantId, 10)

    if (isNaN(restaurantIdNum)) {
      return NextResponse.json(
        { error: 'Invalid restaurant ID' },
        { status: 400 }
      )
    }

    // Check if user has access to this restaurant
    const accessResult = await verifyRestaurantAccess(userId, restaurantId)
    if (!accessResult.hasAccess) {
      const statusCode = accessResult.error === 'NOT_FOUND' ? 404 : 403
      const message =
        accessResult.error === 'NOT_FOUND'
          ? 'Restaurant not found'
          : 'Access denied to this restaurant'
      return NextResponse.json({ error: message }, { status: statusCode })
    }

    // Parse and validate request body
    const body = await request.json()

    // Get locale from request headers
    const locale = getLocaleFromHeaders(request.headers)

    // Create localized schema and validate request data
    const schema = await createRestaurantSettingsSchema(locale)
    const validationResult = schema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Check if slug is unique (excluding current restaurant)
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: restaurantIdNum },
      },
    })

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'URL slug is already taken by another restaurant' },
        { status: 400 }
      )
    }

    // Update restaurant
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantIdNum },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        emailContact: validatedData.emailContact,
        phoneContact: validatedData.phoneContact || null,
        openingHours: validatedData.openingHours,
        slotInterval: parseInt(validatedData.slotInterval, 10),
        minGuestsPerReservation: validatedData.minGuestsPerReservation,
        maxGuestsPerReservation: validatedData.maxGuestsPerReservation,
        maxReservationsPerSlot: validatedData.maxReservationsPerSlot,
        reservationLeadTimeMin: validatedData.reservationLeadTimeMin,
        reservationLeadTimeMax: validatedData.reservationLeadTimeMax,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Restaurant settings updated successfully',
      restaurant: updatedRestaurant,
    })
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
