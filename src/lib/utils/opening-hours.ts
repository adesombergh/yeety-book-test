import { OpeningHours, ServicePeriod } from '@/lib/types/restaurant'
import { formatDuration, type Duration } from 'date-fns'
import { fr } from 'date-fns/locale'

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

export function formatOpeningHours(openingHours?: OpeningHours): string[] {
  if (!openingHours) {
    return []
  }

  const formatted: string[] = []

  for (const day of DAYS_ORDER) {
    const schedule = openingHours[day]
    const dayName = DAY_NAMES[day]

    if (
      !schedule ||
      schedule.closed ||
      !schedule.periods ||
      schedule.periods.length === 0
    ) {
      formatted.push(`${dayName}: Fermé`)
    } else {
      const periodsText = schedule.periods
        .map((period) => `${period.open} - ${period.close}`)
        .join(', ')
      formatted.push(`${dayName}: ${periodsText}`)
    }
  }

  return formatted
}

export function formatTimeRange(hours: number): string {
  // Convert hours to a human-readable duration using date-fns
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  const duration: Duration = {}

  if (days > 0) {
    duration.days = days
  }
  if (remainingHours > 0) {
    duration.hours = remainingHours
  }

  // If it's less than 24 hours, just show hours
  // If it's 24 hours or more, show days (and hours if there are any remaining)
  return formatDuration(duration, {
    locale: fr,
    format: days > 0 ? ['days', 'hours'] : ['hours'],
  })
}

export function getServicePeriodsForDate(
  openingHours: OpeningHours,
  date: Date
): ServicePeriod[] {
  if (!openingHours) {
    return []
  }

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

  if (!schedule || schedule.closed) {
    return []
  }

  return schedule.periods || []
}

export function isRestaurantOpen(
  openingHours?: OpeningHours,
  date: Date = new Date()
): boolean | null {
  if (!openingHours) return false
  const periods = getServicePeriodsForDate(openingHours, date)

  if (periods.length === 0) {
    return false
  }

  const currentTime = date.toTimeString().slice(0, 5) // HH:MM format

  // Check if current time falls within any service period
  return periods.some((period) => {
    return currentTime >= period.open && currentTime <= period.close
  })
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

  return schedule.closed || schedule.periods.length === 0
}
