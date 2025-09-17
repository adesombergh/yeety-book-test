import { z } from 'zod'

// Day schedule schema for opening hours
const dayScheduleSchema = z
  .object({
    closed: z.boolean(),
    open: z.string().optional(),
    close: z.string().optional(),
  })
  .refine(
    (data) => {
      // If not closed, both open and close times must be provided
      if (!data.closed) {
        return data.open && data.close
      }
      return true
    },
    {
      message: 'Open and close times are required when not closed',
    }
  )
  .refine(
    (data) => {
      // If not closed, open time must be before close time
      if (!data.closed && data.open && data.close) {
        const openTime = new Date(`1970-01-01T${data.open}:00`)
        const closeTime = new Date(`1970-01-01T${data.close}:00`)
        return openTime < closeTime
      }
      return true
    },
    {
      message: 'Open time must be before close time',
    }
  )

// Opening hours schema
const openingHoursSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
})

// Main restaurant settings schema
export const restaurantSettingsSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Restaurant name is required')
      .max(100, 'Restaurant name must be less than 100 characters'),
    slug: z
      .string()
      .min(1, 'URL slug is required')
      .max(50, 'URL slug must be less than 50 characters')
      .regex(
        /^[a-z0-9-]+$/,
        'URL slug can only contain lowercase letters, numbers, and hyphens'
      ),
    emailContact: z.string().email('Please enter a valid email address'),
    phoneContact: z.string().optional(),
    openingHours: openingHoursSchema,
    slotInterval: z.string().refine((val) => ['15', '30', '60'].includes(val), {
      message: 'Please select a valid time slot interval',
    }),
    minGuestsPerReservation: z
      .number()
      .int('Must be a whole number')
      .min(1, 'Minimum guests must be at least 1')
      .max(20, 'Minimum guests cannot exceed 20'),
    maxGuestsPerReservation: z
      .number()
      .int('Must be a whole number')
      .min(1, 'Maximum guests must be at least 1')
      .max(50, 'Maximum guests cannot exceed 50'),
    maxReservationsPerSlot: z
      .number()
      .int('Must be a whole number')
      .min(1, 'Maximum reservations per slot must be at least 1')
      .max(100, 'Maximum reservations per slot cannot exceed 100'),
    reservationLeadTimeMin: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Minimum lead time cannot be negative')
      .max(168, 'Minimum lead time cannot exceed 168 hours (1 week)'),
    reservationLeadTimeMax: z
      .number()
      .int('Must be a whole number')
      .min(1, 'Maximum lead time must be at least 1 day')
      .max(365, 'Maximum lead time cannot exceed 365 days'),
  })
  .refine(
    (data) => {
      // Ensure min guests <= max guests
      return data.minGuestsPerReservation <= data.maxGuestsPerReservation
    },
    {
      message: 'Minimum guests cannot be greater than maximum guests',
      path: ['minGuestsPerReservation'],
    }
  )
  .refine(
    (data) => {
      // Ensure min lead time < max lead time (convert max from days to hours)
      return data.reservationLeadTimeMin < data.reservationLeadTimeMax * 24
    },
    {
      message: 'Minimum lead time must be less than maximum lead time',
      path: ['reservationLeadTimeMin'],
    }
  )

export type RestaurantSettingsFormData = z.infer<
  typeof restaurantSettingsSchema
>
