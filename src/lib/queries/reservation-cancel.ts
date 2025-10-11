import prisma from '@/lib/prisma'

export interface ReservationCancelData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  date: Date
  guests: number
  notes: string | null
  status: string
  cancelToken: string | null
  restaurant: {
    name: string
    slug: string
    emailContact: string | null
  }
}

export interface ReservationCancelResult {
  reservation: ReservationCancelData | null
  error: string | null
}

/**
 * Find a reservation by its cancel token
 * Server-side only function for fetching reservation data
 */
export async function getReservationByCancelToken(
  cancelToken: string
): Promise<ReservationCancelResult> {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { cancelToken },
      include: {
        restaurant: {
          select: {
            name: true,
            slug: true,
            emailContact: true,
          },
        },
      },
    })

    console.log({ reservation, cancelToken })

    if (!reservation) {
      return {
        reservation: null,
        error: 'Invalid or expired cancellation link',
      }
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'CANCELLED') {
      return {
        reservation: null,
        error: 'This reservation has already been cancelled',
      }
    }

    // Check if reservation is in the past
    const now = new Date()
    if (reservation.date < now) {
      return {
        reservation: null,
        error: 'Cannot cancel a reservation that has already passed',
      }
    }

    return {
      reservation: {
        id: reservation.id,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        guests: reservation.guests,
        notes: reservation.notes,
        status: reservation.status,
        cancelToken: reservation.cancelToken,
        restaurant: reservation.restaurant,
      },
      error: null,
    }
  } catch (error) {
    console.error('Error fetching reservation by cancel token:', error)
    return {
      reservation: null,
      error: 'Failed to load reservation details',
    }
  }
}
