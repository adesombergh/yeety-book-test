import { z } from 'zod'
import { getTranslations } from 'next-intl/server'

// Helper function to check if two time periods overlap
function periodsOverlap(
  period1: { open: string; close: string },
  period2: { open: string; close: string }
): boolean {
  const start1 = new Date(`1970-01-01T${period1.open}:00`)
  const end1 = new Date(`1970-01-01T${period1.close}:00`)
  const start2 = new Date(`1970-01-01T${period2.open}:00`)
  const end2 = new Date(`1970-01-01T${period2.close}:00`)

  return start1 < end2 && start2 < end1
}

// Function to create localized service period schema
async function createServicePeriodSchema(
  t: Awaited<ReturnType<typeof getTranslations>>
) {
  return z
    .object({
      open: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: t('restaurant.openingHours.timeFormat'),
      }),
      close: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: t('restaurant.openingHours.timeFormat'),
      }),
      label: z.string().optional(),
    })
    .refine(
      (data) => {
        const openTime = new Date(`1970-01-01T${data.open}:00`)
        const closeTime = new Date(`1970-01-01T${data.close}:00`)
        return openTime < closeTime
      },
      {
        message: t('restaurant.openingHours.timeOrder'),
      }
    )
}

// Function to create localized day schedule schema
async function createDayScheduleSchema(
  t: Awaited<ReturnType<typeof getTranslations>>
) {
  const servicePeriodSchema = await createServicePeriodSchema(t)

  return z
    .object({
      closed: z.boolean(),
      periods: z.array(servicePeriodSchema),
    })
    .refine(
      (data) => {
        // If closed, periods must be empty
        if (data.closed) {
          return data.periods.length === 0
        }
        // If not closed, must have at least one period
        return data.periods.length > 0
      },
      {
        message: t('restaurant.openingHours.periodsRequired'),
      }
    )
    .refine(
      (data) => {
        // Check for overlapping periods
        if (data.periods.length < 2) return true

        for (let i = 0; i < data.periods.length; i++) {
          for (let j = i + 1; j < data.periods.length; j++) {
            if (periodsOverlap(data.periods[i], data.periods[j])) {
              return false
            }
          }
        }
        return true
      },
      {
        message: t('restaurant.openingHours.overlappingPeriods'),
      }
    )
}

// Function to create localized restaurant settings schema
export async function createRestaurantSettingsSchema() {
  const t = await getTranslations('validation')

  const dayScheduleSchema = await createDayScheduleSchema(t)

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
  return z
    .object({
      name: z.string().min(1, t('required')).max(100, t('restaurant.name.max')),
      slug: z
        .string()
        .min(1, t('required'))
        .max(50, t('restaurant.slug.max'))
        .regex(/^[a-z0-9-]+$/, t('restaurant.slug.format')),
      emailContact: z
        .string()
        .email(t('restaurant.email.invalid'))
        .or(z.literal(''))
        .optional(),
      phoneContact: z.string().optional(),
      openingHours: openingHoursSchema,
      slotInterval: z
        .string()
        .refine((val) => ['15', '30', '60'].includes(val), {
          message: t('restaurant.slotInterval.invalid'),
        }),
      minGuestsPerReservation: z
        .number()
        .int(t('number.int'))
        .min(1, t('number.min', { min: 1 }))
        .max(20, t('number.max', { max: 20 })),
      maxGuestsPerReservation: z
        .number()
        .int(t('number.int'))
        .min(1, t('number.min', { min: 1 }))
        .max(50, t('number.max', { max: 50 })),
      maxReservationsPerSlot: z
        .number()
        .int(t('number.int'))
        .min(1, t('number.min', { min: 1 }))
        .max(100, t('number.max', { max: 100 })),
      reservationLeadTimeMinHours: z
        .number()
        .int(t('number.int'))
        .min(0, t('number.min', { min: 0 }))
        .max(168, t('number.max', { max: 168 })),
      // reservationLeadTimeMaxHours: z
      //   .number()
      //   .int(t('number.int'))
      //   .min(1, t('number.min', { min: 1 }))
      //   .max(365, t('number.max', { max: 365 })),
    })
    .refine(
      (data) => {
        // Ensure min guests <= max guests
        return data.minGuestsPerReservation <= data.maxGuestsPerReservation
      },
      {
        message: t('restaurant.guests.minMax'),
        path: ['minGuestsPerReservation'],
      }
    )
}

// Default service period schema for client-side use
const defaultServicePeriodSchema = z
  .object({
    open: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Time must be in HH:MM format',
    }),
    close: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Time must be in HH:MM format',
    }),
    label: z.string().optional(),
  })
  .refine(
    (data) => {
      const openTime = new Date(`1970-01-01T${data.open}:00`)
      const closeTime = new Date(`1970-01-01T${data.close}:00`)
      return openTime < closeTime
    },
    {
      message: 'Open time must be before close time',
    }
  )

// Create a default English schema for client-side use
const defaultDayScheduleSchema = z
  .object({
    closed: z.boolean(),
    periods: z.array(defaultServicePeriodSchema),
  })
  .refine(
    (data) => {
      // If closed, periods must be empty
      if (data.closed) {
        return data.periods.length === 0
      }
      // If not closed, must have at least one period
      return data.periods.length > 0
    },
    {
      message: 'At least one service period is required when not closed',
    }
  )
  .refine(
    (data) => {
      // Check for overlapping periods
      if (data.periods.length < 2) return true

      for (let i = 0; i < data.periods.length; i++) {
        for (let j = i + 1; j < data.periods.length; j++) {
          if (periodsOverlap(data.periods[i], data.periods[j])) {
            return false
          }
        }
      }
      return true
    },
    {
      message: 'Service periods cannot overlap',
    }
  )

// Default opening hours schema
const defaultOpeningHoursSchema = z.object({
  monday: defaultDayScheduleSchema,
  tuesday: defaultDayScheduleSchema,
  wednesday: defaultDayScheduleSchema,
  thursday: defaultDayScheduleSchema,
  friday: defaultDayScheduleSchema,
  saturday: defaultDayScheduleSchema,
  sunday: defaultDayScheduleSchema,
})

// Default restaurant settings schema (English) for client-side use
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
    logo: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: 'Logo must be less than 10MB',
      })
      .refine(
        (file) => {
          const acceptedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
          ]
          return acceptedTypes.includes(file.type)
        },
        {
          message: 'Logo must be an image (JPEG, PNG, WebP, or GIF)',
        }
      )
      .optional()
      .nullable(),
    removeLogo: z.boolean().optional(),
    emailContact: z
      .string()
      .email('Please enter a valid email address')
      .or(z.literal(''))
      .optional(),
    phoneContact: z.string().optional(),
    openingHours: defaultOpeningHoursSchema,
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
    reservationLeadTimeMinHours: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Minimum lead time cannot be negative')
      .max(168, 'Minimum lead time cannot exceed 168 hours (1 week)'),
    // reservationLeadTimeMaxHours: z
    //   .number()
    //   .int('Must be a whole number')
    //   .min(1, 'Maximum lead time must be at least 1 day')
    //   .max(365, 'Maximum lead time cannot exceed 365 days'),
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

// Type for form data
export type RestaurantSettingsFormData = z.infer<
  typeof restaurantSettingsSchema
>
