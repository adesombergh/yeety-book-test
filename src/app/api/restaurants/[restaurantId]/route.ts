import { verifyRestaurantAccess } from '@/lib/auth/restaurant-access'
import prisma from '@/lib/prisma'
import {
  uploadRestaurantLogo,
  deleteRestaurantLogo,
  validateImageFile,
} from '@/lib/utils/supabase-storage'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

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

    // Get current restaurant data for logo management
    const currentRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantIdNum },
      select: { logoUrl: true },
    })

    // Parse FormData
    const formData = await request.formData()

    // Extract fields from FormData
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const emailContact = formData.get('emailContact') as string
    const phoneContact = formData.get('phoneContact') as string
    const openingHoursStr = formData.get('openingHours') as string
    const slotInterval = formData.get('slotInterval') as string
    const minGuestsPerReservation = parseInt(
      formData.get('minGuestsPerReservation') as string,
      10
    )
    const maxGuestsPerReservation = parseInt(
      formData.get('maxGuestsPerReservation') as string,
      10
    )
    const maxReservationsPerSlot = parseInt(
      formData.get('maxReservationsPerSlot') as string,
      10
    )
    const reservationLeadTimeMinHours = parseInt(
      formData.get('reservationLeadTimeMinHours') as string,
      10
    )
    // const reservationLeadTimeMaxHours = parseInt(
    //   formData.get('reservationLeadTimeMaxHours') as string,
    //   10
    // )
    const logoFile = formData.get('logo') as File | null
    const removeLogo = formData.get('removeLogo') === 'true'

    // Parse opening hours
    const openingHours = JSON.parse(openingHoursStr)

    // Basic validation
    if (!name || !slug || !emailContact || !openingHours || !slotInterval) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate logo file if present
    if (logoFile && logoFile.size > 0) {
      const validation = validateImageFile(logoFile, 10)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }
    }

    // Check if slug is unique (excluding current restaurant)
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        slug: slug,
        id: { not: restaurantIdNum },
      },
    })

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'URL slug is already taken by another restaurant' },
        { status: 400 }
      )
    }

    // Handle logo upload/deletion
    let newLogoUrl: string | null = currentRestaurant?.logoUrl || null

    // If removeLogo flag is set, delete the current logo
    if (removeLogo && currentRestaurant?.logoUrl) {
      const deleteResult = await deleteRestaurantLogo(currentRestaurant.logoUrl)
      if (!deleteResult.success) {
        console.error('Failed to delete logo:', deleteResult.error)
      }
      newLogoUrl = null
    }

    // If a new logo file is uploaded
    if (logoFile && logoFile.size > 0) {
      // Delete old logo if it exists
      if (currentRestaurant?.logoUrl) {
        const deleteResult = await deleteRestaurantLogo(
          currentRestaurant.logoUrl
        )
        if (!deleteResult.success) {
          console.error('Failed to delete old logo:', deleteResult.error)
        }
      }

      // Upload new logo
      const uploadResult = await uploadRestaurantLogo(restaurantId, logoFile)
      if (uploadResult.error || !uploadResult.url) {
        return NextResponse.json(
          { error: uploadResult.error || 'Failed to upload logo' },
          { status: 500 }
        )
      }
      newLogoUrl = uploadResult.url
    }

    // Update restaurant
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantIdNum },
      data: {
        name,
        slug,
        logoUrl: newLogoUrl,
        emailContact,
        phoneContact: phoneContact || null,
        openingHours,
        slotInterval: parseInt(slotInterval, 10),
        minGuestsPerReservation,
        maxGuestsPerReservation,
        maxReservationsPerSlot,
        reservationLeadTimeMinHours,
        // reservationLeadTimeMaxHours,
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
