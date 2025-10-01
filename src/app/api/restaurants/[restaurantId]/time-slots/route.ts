import { NextRequest, NextResponse } from 'next/server'
import { getRestaurantById } from '@/lib/queries/restaurant'
import { getReservationCountsByTimeSlot } from '@/lib/queries/time-slot-availability'
import {
  generateTimeSlotsForDay,
  getDayOfWeek,
  isRestaurantOpenOnDay,
} from '@/lib/utils/time-slots'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { restaurantId: restaurantIdParam } = await params

    // Parse and validate restaurant ID
    const restaurantId = parseInt(restaurantIdParam)
    if (isNaN(restaurantId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid restaurant ID' },
        { status: 400 }
      )
    }

    // Get date parameter from query string
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json(
        { success: false, error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Parse and validate date
    const requestedDate = new Date(dateParam)
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Fetch restaurant configuration
    const { restaurant, error } = await getRestaurantById(restaurantId)

    if (error || !restaurant) {
      return NextResponse.json(
        { success: false, error: error || 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Get day of week
    const dayOfWeek = getDayOfWeek(requestedDate)

    // Check if restaurant is open on this day
    const restaurantOpen = isRestaurantOpenOnDay(
      restaurant.openingHours,
      requestedDate
    )

    // If restaurant is closed, return empty slots
    if (!restaurantOpen) {
      return NextResponse.json({
        success: true,
        data: {
          date: dateParam,
          dayOfWeek,
          restaurantOpen: false,
          slots: [],
        },
      })
    }

    // Generate time slots for the day
    const timeSlots = generateTimeSlotsForDay(
      requestedDate,
      restaurant.openingHours,
      restaurant.slotInterval,
      restaurant.reservationLeadTimeMin
    )

    // Get reservation counts for the day
    const reservationCounts = await getReservationCountsByTimeSlot(
      restaurantId,
      requestedDate
    )

    // Combine slots with availability information
    const slotsWithAvailability = timeSlots.map((slot) => {
      const reservationCount = reservationCounts.get(slot.time) || 0
      const available = reservationCount < restaurant.maxReservationsPerSlot
      const remainingCapacity =
        restaurant.maxReservationsPerSlot - reservationCount

      return {
        time: slot.time,
        available,
        remainingCapacity: Math.max(0, remainingCapacity),
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        date: dateParam,
        dayOfWeek,
        restaurantOpen: true,
        slots: slotsWithAvailability,
      },
    })
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
