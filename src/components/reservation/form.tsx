'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import {
  CalendarIcon,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Turnstile } from '@marsidev/react-turnstile'
import { cn } from '@/lib/utils'
import { isRestaurantClosedOnDate } from '@/lib/utils/opening-hours'
import type { OpeningHours } from '@/lib/types/restaurant'

// Validation schema
const reservationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long'),
  email: z.email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number too long'),
  date: z.date({
    message: 'Please select a date',
  }),
  time: z.string().min(1, 'Please select a time'),
  guests: z.number().min(1, 'At least 1 guest required'),
  notes: z.string().max(500, 'Notes too long').optional(),
  turnstileToken: z
    .string()
    .min(1, 'Please complete the security verification'),
})

type ReservationFormData = z.infer<typeof reservationSchema>

interface ReservationFormProps {
  restaurantId: number
  restaurantSlug: string
  minGuests: number
  maxGuests: number
  openingHours: OpeningHours
  leadTimeMinHours: number
  leadTimeMaxHours: number
  turnstileSiteKey: string
  onSuccess?: () => void
}

interface TimeSlot {
  time: string
  available: boolean
  remainingCapacity: number
}

interface TimeSlotsResponse {
  success: boolean
  data?: {
    date: string
    dayOfWeek: string
    restaurantOpen: boolean
    slots: TimeSlot[]
  }
  error?: string
}

export function ReservationForm({
  restaurantId,
  restaurantSlug,
  minGuests,
  maxGuests,
  openingHours,
  leadTimeMinHours,
  leadTimeMaxHours,
  turnstileSiteKey,
  onSuccess,
}: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [restaurantOpen, setRestaurantOpen] = useState(true)
  const router = useRouter()
  const t = useTranslations()

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: minGuests,
    },
  })

  const selectedDate = form.watch('date')

  // Calculate min/max dates based on lead times (in hours)
  const HOURS_TO_MS = 60 * 60 * 1000
  const today = new Date()
  const minDate = new Date(today.getTime() + leadTimeMinHours * HOURS_TO_MS)
  const maxDate = new Date(today.getTime() + leadTimeMaxHours * HOURS_TO_MS)

  // Fetch time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([])
      setRestaurantOpen(true)
      return
    }

    const fetchTimeSlots = async () => {
      setIsLoadingTimeSlots(true)
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd')
        const response = await fetch(
          `/api/restaurants/${restaurantId}/time-slots?date=${dateString}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch time slots')
        }

        const result: TimeSlotsResponse = await response.json()

        if (result.success && result.data) {
          setRestaurantOpen(result.data.restaurantOpen)
          setAvailableTimeSlots(result.data.slots)

          // Reset time selection when date changes
          form.setValue('time', '')
        } else {
          throw new Error(result.error || 'Failed to load time slots')
        }
      } catch (error) {
        console.error('Error fetching time slots:', error)
        setAvailableTimeSlots([])
        setRestaurantOpen(true)
      } finally {
        setIsLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [selectedDate, restaurantId, form])

  const onSubmit = async (data: ReservationFormData) => {
    if (!turnstileToken) {
      setSubmitError('Please complete the security verification')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(':').map(Number)
      const reservationDateTime = new Date(data.date)
      reservationDateTime.setHours(hours, minutes, 0, 0)

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          date: reservationDateTime.toISOString(),
          guests: data.guests,
          notes: data.notes || '',
          turnstileToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create reservation')
      }

      // Success - redirect to success page
      const result = await response.json()
      router.push(
        `/${restaurantSlug}/reservation/success?id=${result.reservation.id}`
      )

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token)
    form.setValue('turnstileToken', token)
  }

  const handleTurnstileError = () => {
    setTurnstileToken('')
    form.setValue('turnstileToken', '')
    setSubmitError('Security verification failed. Please try again.')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isSubmitting} className="space-y-6">
          {/* Date Selection */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {t('forms.date')}
                </FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="input"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, 'PPP')
                          : t('forms.selectDate')}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      startMonth={minDate}
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setCalendarOpen(false)
                      }}
                      disabled={(date) =>
                        date < minDate ||
                        date > maxDate ||
                        isRestaurantClosedOnDate(openingHours, date)
                      }
                      modifiers={{
                        closed: (date) =>
                          isRestaurantClosedOnDate(openingHours, date),
                      }}
                      modifiersClassNames={{
                        closed:
                          'line-through opacity-40 bg-gray-100 dark:bg-gray-800',
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Selection */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('forms.time')}
                </FormLabel>
                {!selectedDate ? (
                  <p className="text-sm text-muted-foreground">
                    {t('forms.selectDateFirst')}
                  </p>
                ) : isLoadingTimeSlots ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      {t('forms.loadingTimeSlots')}
                    </span>
                  </div>
                ) : !restaurantOpen ? (
                  <p className="text-sm text-muted-foreground">
                    {t('forms.restaurantClosedOnDay')}
                  </p>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('forms.noSlotsAvailable')}
                  </p>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedDate || isLoadingTimeSlots}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('forms.selectTime')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem
                          key={slot.time}
                          value={slot.time}
                          disabled={!slot.available}
                        >
                          {slot.time}
                          {!slot.available && ` (${t('forms.slotFull')})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Guest Count */}
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('forms.numberOfGuests')}
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(
                      { length: maxGuests - minGuests + 1 },
                      (_, i) => minGuests + i
                    ).map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count}{' '}
                        {count === 1
                          ? t('forms.guestSingular')
                          : t('forms.guestPlural')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('forms.firstName')}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.enterFirstName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forms.lastName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.enterLastName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('forms.emailAddress')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('forms.enterEmail')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('forms.phoneNumber')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t('forms.enterPhone')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t('forms.specialRequestsOptional')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('forms.specialRequests')}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Turnstile Widget */}
          <FormField
            control={form.control}
            name="turnstileToken"
            render={() => (
              <FormItem>
                <FormLabel>{t('forms.securityVerification')}</FormLabel>
                <FormControl>
                  <Turnstile
                    siteKey={turnstileSiteKey}
                    onSuccess={handleTurnstileSuccess}
                    onError={handleTurnstileError}
                    className="flex justify-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Error */}
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !turnstileToken}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('forms.creatingReservation')}
              </>
            ) : (
              t('forms.makeReservation')
            )}
          </Button>
        </fieldset>
      </form>
    </Form>
  )
}
