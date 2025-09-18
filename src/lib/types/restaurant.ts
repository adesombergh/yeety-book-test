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

export interface DaySchedule {
  open?: string
  close?: string
  closed: boolean
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
