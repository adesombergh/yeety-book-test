import { OpeningHours, DaysOfWeek, ServicePeriod } from '@/lib/types/restaurant'

export interface TimeSlot {
  time: string // "HH:MM" format
  datetime: Date // Full datetime for comparison
}

/**
 * Generates time slots for a single service period
 */
function generateSlotsForPeriod(
  date: Date,
  period: ServicePeriod,
  slotInterval: number,
  minBookableTime: Date
): TimeSlot[] {
  const slots: TimeSlot[] = []

  // Parse opening and closing times
  const [openHour, openMinute] = period.open.split(':').map(Number)
  const [closeHour, closeMinute] = period.close.split(':').map(Number)

  // Handle midnight closing time (00:00) by treating it as hour 24
  const effectiveCloseHour = closeHour === 0 ? 24 : closeHour

  let currentHour = openHour
  let currentMinute = openMinute

  while (
    currentHour < effectiveCloseHour ||
    (currentHour === effectiveCloseHour && currentMinute < closeMinute)
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
 * Generates time slots for a specific day based on restaurant configuration
 * Supports multiple service periods per day (e.g., lunch and dinner)
 * Filters out slots that are:
 * - Before opening time
 * - After closing time
 * - Before current time + lead time minimum
 */
export function generateTimeSlotsForDay(
  date: Date,
  openingHours: OpeningHours | undefined,
  slotInterval: number,
  leadTimeMin: number
): TimeSlot[] {
  if (!openingHours) return []
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

  // If restaurant is closed or has no periods, return empty array
  if (schedule.closed || schedule.periods.length === 0) {
    return []
  }

  // Calculate minimum bookable time (current time + lead time in hours)
  const now = new Date()
  const minBookableTime = new Date(now.getTime() + leadTimeMin * 60 * 60 * 1000)

  // Generate slots for all service periods
  const allSlots: TimeSlot[] = []
  for (const period of schedule.periods) {
    const periodSlots = generateSlotsForPeriod(
      date,
      period,
      slotInterval,
      minBookableTime
    )
    allSlots.push(...periodSlots)
  }

  // Sort slots chronologically
  allSlots.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())

  return allSlots
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
  openingHours: OpeningHours | undefined,
  date: Date
): boolean {
  if (!openingHours) return false
  const dayOfWeek = getDayOfWeek(date)
  const schedule = openingHours[dayOfWeek]
  return !schedule.closed && schedule.periods.length > 0
}
