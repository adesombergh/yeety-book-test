import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getReservationsForCalendar } from '@/lib/queries/reservation-calendar'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!restaurantId || !startDate || !endDate) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: restaurantId, startDate, endDate',
        },
        { status: 400 }
      )
    }

    // Validate date format
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Fetch reservations using the server-side query
    const { reservations, reservationsByDate, error } =
      await getReservationsForCalendar(restaurantId, start, end)

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reservations,
      reservationsByDate,
    })
  } catch (error) {
    console.error('Error fetching calendar reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
