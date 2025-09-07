'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CalendarIcon, Clock, Users } from 'lucide-react'
import { useParams } from 'next/navigation'

const reservationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  guests: z.number().min(1, 'At least 1 guest is required').max(20, 'Maximum 20 guests'),
  date: z.date({
    message: 'Please select a date',
  }),
  time: z.string().min(1, 'Please select a time'),
  comments: z.string().optional(),
})

type ReservationForm = z.infer<typeof reservationSchema>

// Generate time slots (15-minute intervals from 11:00 to 22:00)
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 11; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 22 && minute > 0) break // Stop at 22:00
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

export default function ReservationPage() {
  const {restaurantSlug} = useParams<{restaurantSlug: string}>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  })

  const watchedGuests = watch('guests')
  const watchedTime = watch('time')

  const onSubmit = async (data: ReservationForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          restaurantSlug,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
      } else {
        throw new Error('Failed to create reservation')
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
      // Handle error (show error message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Reservation Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your reservation. You will receive a confirmation email shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Make a Reservation</CardTitle>
            <CardDescription>
              Book your table at {restaurantSlug.replace('-', ' ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reservation Details</h3>

                {/* Number of Guests */}
                <div>
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Select onValueChange={(value) => setValue('guests', parseInt(value))}>
                    <SelectTrigger className={errors.guests ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.guests && (
                    <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
                  )}
                </div>

                {/* Date Selection */}
                <div>
                  <Label>Date *</Label>
                  <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        if (date) setValue('date', date)
                      }}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      className="rounded-md border"
                    />
                  </div>
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Select onValueChange={(value) => setValue('time', value)}>
                    <SelectTrigger className={errors.time ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <Label htmlFor="comments">Special Requests</Label>
                  <Input
                    id="comments"
                    placeholder="Any special requests or dietary requirements..."
                    {...register('comments')}
                  />
                </div>
              </div>

              {/* Summary */}
              {watchedGuests && selectedDate && watchedTime && (
                <Alert>
                  <CalendarIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Reservation Summary:</strong><br />
                    {watchedGuests} {watchedGuests === 1 ? 'guest' : 'guests'} on{' '}
                    {selectedDate.toLocaleDateString()} at {watchedTime}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Reservation...' : 'Confirm Reservation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
