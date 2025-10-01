import { OpeningHours, DaysOfWeek } from '@/lib/types/restaurant'

export interface TimeSlot {
  time: string // "HH:MM" format
  datetime: Date // Full datetime for comparison
}

/**
 * Generates time slots for a specific day based on restaurant configuration
 * Filters out slots that are:
 * - Before opening time
 * - After closing time
 * - Before current time + lead time minimum
 */
export function generateTimeSlotsForDay(
  date: Date,
  openingHours: OpeningHours,
  slotInterval: number,
  leadTimeMin: number
): TimeSlot[] {
  // Get day of week
  const dayNames: DaysOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const dayOfWeek = dayNames[date.getDay()]
  const schedule = openingHours[dayOfWeek]

  // If restaurant is closed, return empty array
  if (schedule.closed || !schedule.open || !schedule.close) {
    return []
  }

  // Parse opening and closing times
  const [openHour, openMinute] = schedule.open.split(':').map(Number)
  const [closeHour, closeMinute] = schedule.close.split(':').map(Number)

  // Calculate minimum bookable time (current time + lead time)
  const now = new Date()
  const minBookableTime = new Date(now.getTime() + leadTimeMin * 60 * 1000)

  // Generate slots
  const slots: TimeSlot[] = []
  let currentHour = openHour
  let currentMinute = openMinute

  while (
    currentHour < closeHour ||
    (currentHour === closeHour && currentMinute < closeMinute)
  ) {
    // Create datetime for this slot
    const slotDateTime = new Date(date)
    slotDateTime.setHours(currentHour, currentMinute, 0, 0)

    // Only include slot if it's after minimum bookable time
    if (slotDateTime >= minBookableTime) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      slots.push({
        time: timeString,
        datetime: slotDateTime,
      })
    }

    // Increment by slot interval
    currentMinute += slotInterval
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60)
      currentMinute = currentMinute % 60
    }
  }

  return slots
}

/**
 * Gets the day of week name from a date
 */
export function getDayOfWeek(date: Date): DaysOfWeek {
  const dayNames: DaysOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  return dayNames[date.getDay()]
}

/**
 * Checks if a restaurant is open on a specific day
 */
export function isRestaurantOpenOnDay(
  openingHours: OpeningHours,
  date: Date
): boolean {
  const dayOfWeek = getDayOfWeek(date)
  const schedule = openingHours[dayOfWeek]
  return !schedule.closed && !!schedule.open && !!schedule.close
}
