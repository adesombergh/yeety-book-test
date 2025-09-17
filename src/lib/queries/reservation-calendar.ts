import prisma from '@/lib/prisma'
import { ReservationStatus } from '@prisma/client'

export interface CalendarReservation {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  date: Date
  guests: number
  status: ReservationStatus
  notes?: string | null
}

export interface CalendarReservationsByDate {
  [dateKey: string]: CalendarReservation[]
}

/**
 * Fetch reservations for a restaurant within a specific date range
 * Optimized for calendar display
 */
export async function getReservationsForCalendar(
  restaurantId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  reservations: CalendarReservation[]
  reservationsByDate: CalendarReservationsByDate
  error?: string
}> {
  try {
    const restaurantIdNum = parseInt(restaurantId, 10)

    if (isNaN(restaurantIdNum)) {
      return {
        reservations: [],
        reservationsByDate: {},
        error: 'Invalid restaurant ID',
      }
    }

    // Fetch reservations within the date range
    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: restaurantIdNum,
        date: {
          gte: startDate,
          lte: endDate,
        },
        // Exclude cancelled reservations from calendar display
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        date: true,
        guests: true,
        status: true,
        notes: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Group reservations by date for easier calendar rendering
    const reservationsByDate: CalendarReservationsByDate = {}

    reservations.forEach((reservation) => {
      const dateKey = reservation.date.toISOString().split('T')[0] // YYYY-MM-DD format

      if (!reservationsByDate[dateKey]) {
        reservationsByDate[dateKey] = []
      }

      reservationsByDate[dateKey].push(reservation)
    })

    return {
      reservations,
      reservationsByDate,
    }
  } catch (error) {
    console.error('Error fetching calendar reservations:', error)
    return {
      reservations: [],
      reservationsByDate: {},
      error: 'Failed to fetch reservations',
    }
  }
}

/**
 * Get reservations for a specific date and time slot
 */
export function getReservationsForTimeSlot(
  reservationsByDate: CalendarReservationsByDate,
  date: Date,
  timeSlot: string
): CalendarReservation[] {
  const dateKey = date.toISOString().split('T')[0]
  const dayReservations = reservationsByDate[dateKey] || []

  return dayReservations.filter((reservation) => {
    const reservationTime = reservation.date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
    return reservationTime === timeSlot
  })
}
