import prisma from '@/lib/prisma'

export interface SlotAvailability {
  time: string
  reservationCount: number
}

/**
 * Gets reservation counts for specific time slots on a given date
 * Counts both PENDING and CONFIRMED reservations
 *
 * @param restaurantId - The restaurant ID
 * @param date - The date to check (time component ignored)
 * @param timeSlots - Array of time strings in "HH:MM" format
 * @returns Map of time -> reservation count
 */
export async function getReservationCountsByTimeSlot(
  restaurantId: number,
  date: Date
): Promise<Map<string, number>> {
  // Set date boundaries (start and end of day)
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  // Fetch all reservations for the restaurant on this date
  const reservations = await prisma.reservation.findMany({
    where: {
      restaurantId,
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
    select: {
      date: true,
    },
  })

  // Group reservations by time slot
  const countsByTime = new Map<string, number>()

  for (const reservation of reservations) {
    // Extract time in HH:MM format
    const hours = reservation.date.getHours().toString().padStart(2, '0')
    const minutes = reservation.date.getMinutes().toString().padStart(2, '0')
    const timeKey = `${hours}:${minutes}`

    // Increment count for this time slot
    const currentCount = countsByTime.get(timeKey) || 0
    countsByTime.set(timeKey, currentCount + 1)
  }

  return countsByTime
}
