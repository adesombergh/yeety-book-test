import { Restaurant } from '@prisma/client';

// Opening hours JSON structure (since Prisma treats JSON as any)
export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open?: string;
  close?: string;
  closed: boolean;
}

// Typed restaurant with proper opening hours
export interface RestaurantWithTypedHours extends Omit<Restaurant, 'openingHours'> {
  openingHours: OpeningHours;
}

// Query result wrapper for error handling
export interface RestaurantQueryResult {
  restaurant: RestaurantWithTypedHours | null;
  error: string | null;
}
