import { OpeningHours } from '@/lib/types/restaurant'

const DAYS_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const
const DAY_NAMES = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
} as const

export function formatOpeningHours(openingHours: OpeningHours): string[] {
  const formatted: string[] = []

  for (const day of DAYS_ORDER) {
    const schedule = openingHours[day]
    const dayName = DAY_NAMES[day]

    if (schedule.closed) {
      formatted.push(`${dayName}: Closed`)
    } else if (schedule.open && schedule.close) {
      formatted.push(`${dayName}: ${schedule.open} - ${schedule.close}`)
    } else {
      formatted.push(`${dayName}: Hours not set`)
    }
  }

  return formatted
}

export function formatTimeRange(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`
  }

  return `${hours}h ${remainingMinutes}m`
}

export function isRestaurantOpen(
  openingHours: OpeningHours,
  date: Date = new Date()
): boolean {
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const
  const currentDay = dayNames[date.getDay()]
  const schedule = openingHours[currentDay]

  if (schedule.closed || !schedule.open || !schedule.close) {
    return false
  }

  const currentTime = date.toTimeString().slice(0, 5) // HH:MM format
  return currentTime >= schedule.open && currentTime <= schedule.close
}

export function isRestaurantClosedOnDate(
  openingHours: OpeningHours,
  date: Date
): boolean {
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const
  const dayOfWeek = dayNames[date.getDay()]
  const schedule = openingHours[dayOfWeek]

  return schedule.closed || !schedule.open || !schedule.close
}
