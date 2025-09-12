'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Users, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Turnstile } from '@marsidev/react-turnstile';
import { cn } from '@/lib/utils';

// Validation schema
const reservationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number too long'),
  date: z.date({
    message: 'Please select a date',
  }),
  time: z.string().min(1, 'Please select a time'),
  guests: z.number().min(1, 'At least 1 guest required'),
  notes: z.string().max(500, 'Notes too long').optional(),
  turnstileToken: z.string().min(1, 'Please complete the security verification'),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  restaurantId: number;
  restaurantSlug: string;
  minGuests: number;
  maxGuests: number;
  slotInterval: number;
  openingHours: unknown;
  leadTimeMin: number;
  leadTimeMax: number;
  turnstileSiteKey: string;
  onSuccess?: () => void;
}

// Generate time slots based on interval
function generateTimeSlots(interval: number): string[] {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 22; // 10 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }

  return slots;
}

export function ReservationForm({
  restaurantId,
  restaurantSlug,
  minGuests,
  maxGuests,
  slotInterval,
  leadTimeMin,
  leadTimeMax,
  turnstileSiteKey,
  onSuccess,
}: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: minGuests,
    },
  });

  const selectedDate = watch('date');
  const timeSlots = generateTimeSlots(slotInterval);

  // Calculate min/max dates based on lead times
  const today = new Date();
  const minDate = new Date(today.getTime() + leadTimeMin * 60 * 1000);
  const maxDate = new Date(today.getTime() + leadTimeMax * 60 * 1000);

  const onSubmit = async (data: ReservationFormData) => {
    if (!turnstileToken) {
      setSubmitError('Please complete the security verification');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(':').map(Number);
      const reservationDateTime = new Date(data.date);
      reservationDateTime.setHours(hours, minutes, 0, 0);

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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create reservation');
      }

      // Success - redirect to success page
      const result = await response.json();
      window.location.href = `/${restaurantSlug}/reservation/success?id=${result.reservation.id}`;

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setValue('turnstileToken', token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken('');
    setValue('turnstileToken', '');
    setSubmitError('Security verification failed. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="date" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Reservation Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="input"
              className={cn(
                'w-full justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setValue('date', date!)}
              disabled={(date) => date < minDate || date > maxDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      {/* Time Selection */}
      <div className="space-y-2">
        <Label htmlFor="time" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Time
        </Label>
        <Select onValueChange={(value) => setValue('time', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && (
          <p className="text-sm text-red-600">{errors.time.message}</p>
        )}
      </div>

      {/* Guest Count */}
      <div className="space-y-2">
        <Label htmlFor="guests" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Number of Guests
        </Label>
        <Select
          onValueChange={(value) => setValue('guests', parseInt(value))}
          defaultValue={minGuests.toString()}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxGuests - minGuests + 1 }, (_, i) => minGuests + i).map((count) => (
              <SelectItem key={count} value={count.toString()}>
                {count} {count === 1 ? 'Guest' : 'Guests'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.guests && (
          <p className="text-sm text-red-600">{errors.guests.message}</p>
        )}
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            First Name
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Special Requests (Optional)
        </Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Any special requests or dietary requirements?"
          rows={3}
        />
        {errors.notes && (
          <p className="text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Turnstile Widget */}
      <div className="space-y-2">
        <Label>Security Verification</Label>
        <Turnstile
          siteKey={turnstileSiteKey}
          onSuccess={handleTurnstileSuccess}
          onError={handleTurnstileError}
          className="flex justify-center"
        />
        {errors.turnstileToken && (
          <p className="text-sm text-red-600">{errors.turnstileToken.message}</p>
        )}
      </div>

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
        {isSubmitting ? 'Creating Reservation...' : 'Make Reservation'}
      </Button>
    </form>
  );
}
