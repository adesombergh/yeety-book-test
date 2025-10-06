import { Restaurant } from '@prisma/client'

// Opening hours JSON structure (since Prisma treats JSON as any)
export type DaysOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
export const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] satisfies DaysOfWeek[]
export type OpeningHours = Record<DaysOfWeek, DaySchedule>

export interface ServicePeriod {
  open: string // "11:30"
  close: string // "14:00"
  label?: string // optional, e.g. "lunch" or "dinner"
}

export interface DaySchedule {
  closed: boolean
  periods: ServicePeriod[]
}

// Typed restaurant with proper opening hours
export interface RestaurantWithTypedHours
  extends Omit<Restaurant, 'openingHours'> {
  openingHours: OpeningHours
}

// Query result wrapper for error handling
export interface RestaurantQueryResult {
  restaurant: RestaurantWithTypedHours | null
  error: string | null
}
