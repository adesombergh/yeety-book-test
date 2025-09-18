'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  restaurantSettingsSchema,
  type RestaurantSettingsFormData,
} from '@/lib/schemas/restaurant-settings'
import type { RestaurantWithTypedHours } from '@/lib/types/restaurant'

interface RestaurantSettingsFormProps {
  restaurantId: string
  initialData: RestaurantWithTypedHours
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

const SLOT_INTERVALS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '60 minutes' },
]

export function RestaurantSettingsForm({
  restaurantId,
  initialData,
}: RestaurantSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<RestaurantSettingsFormData>({
    resolver: zodResolver(restaurantSettingsSchema),
    defaultValues: {
      name: initialData.name,
      slug: initialData.slug,
      emailContact: initialData.emailContact,
      phoneContact: initialData.phoneContact || '',
      openingHours: initialData.openingHours,
      slotInterval: initialData.slotInterval.toString(),
      minGuestsPerReservation: initialData.minGuestsPerReservation,
      maxGuestsPerReservation: initialData.maxGuestsPerReservation,
      maxReservationsPerSlot: initialData.maxReservationsPerSlot,
      reservationLeadTimeMin: initialData.reservationLeadTimeMin,
      reservationLeadTimeMax: initialData.reservationLeadTimeMax,
    },
  })

  const onSubmit = async (data: RestaurantSettingsFormData) => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save settings')
      }

      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save settings'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter restaurant name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="restaurant-slug"
                className="w-full"
              />
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug.message}</p>
              )}
              <p className="text-sm text-text-secondary">
                This will be used in your booking URL:
                yoursite.com/restaurant-slug
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emailContact">Contact Email</Label>
              <Input
                id="emailContact"
                {...register('emailContact')}
                type="email"
                placeholder="contact@restaurant.com"
                className="w-full"
              />
              {errors.emailContact && (
                <p className="text-sm text-red-600">
                  {errors.emailContact.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneContact">Contact Phone</Label>
              <Input
                id="phoneContact"
                {...register('phoneContact')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
              {errors.phoneContact && (
                <p className="text-sm text-red-600">
                  {errors.phoneContact.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Opening Hours Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Opening Hours
            </h2>
            <p className="text-text-secondary">
              Set your restaurant&apos;s operating hours for each day of the
              week.
            </p>
          </div>

          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const dayKey =
                day.key as keyof RestaurantSettingsFormData['openingHours']
              const isClosed = watch(`openingHours.${dayKey}.closed`)

              return (
                <div key={day.key} className="flex items-center gap-4 h-9">
                  <div className="w-24">
                    <Label className="font-medium">{day.label}</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name={`openingHours.${dayKey}.closed`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${day.key}-closed`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor={`${day.key}-closed`}
                            className="text-sm"
                          >
                            Closed
                          </Label>
                        </div>
                      )}
                    />
                  </div>

                  {!isClosed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${day.key}-open`} className="text-sm">
                          Open:
                        </Label>
                        <Input
                          id={`${day.key}-open`}
                          {...register(`openingHours.${dayKey}.open`)}
                          type="time"
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${day.key}-close`} className="text-sm">
                          Close:
                        </Label>
                        <Input
                          id={`${day.key}-close`}
                          {...register(`openingHours.${dayKey}.close`)}
                          type="time"
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
          {errors.openingHours && (
            <p className="text-sm text-red-600">
              Please check your opening hours configuration
            </p>
          )}
        </div>
      </Card>

      {/* Reservation Constraints Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Reservation Settings
            </h2>
            <p className="text-text-secondary">
              Configure reservation constraints and booking rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minGuestsPerReservation">Minimum Guests</Label>
              <Input
                id="minGuestsPerReservation"
                {...register('minGuestsPerReservation', {
                  valueAsNumber: true,
                })}
                type="number"
                min="1"
                className="w-full"
              />
              {errors.minGuestsPerReservation && (
                <p className="text-sm text-red-600">
                  {errors.minGuestsPerReservation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuestsPerReservation">Maximum Guests</Label>
              <Input
                id="maxGuestsPerReservation"
                {...register('maxGuestsPerReservation', {
                  valueAsNumber: true,
                })}
                type="number"
                min="1"
                className="w-full"
              />
              {errors.maxGuestsPerReservation && (
                <p className="text-sm text-red-600">
                  {errors.maxGuestsPerReservation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxReservationsPerSlot">
                Max Reservations per Slot
              </Label>
              <Input
                id="maxReservationsPerSlot"
                {...register('maxReservationsPerSlot', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full"
              />
              {errors.maxReservationsPerSlot && (
                <p className="text-sm text-red-600">
                  {errors.maxReservationsPerSlot.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="slotInterval">Time Slot Interval</Label>
              <Controller
                name="slotInterval"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {SLOT_INTERVALS.map((interval) => (
                        <SelectItem key={interval.value} value={interval.value}>
                          {interval.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.slotInterval && (
                <p className="text-sm text-red-600">
                  {errors.slotInterval.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservationLeadTimeMin">
                Minimum Lead Time (hours)
              </Label>
              <Input
                id="reservationLeadTimeMin"
                {...register('reservationLeadTimeMin', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full"
              />
              {errors.reservationLeadTimeMin && (
                <p className="text-sm text-red-600">
                  {errors.reservationLeadTimeMin.message}
                </p>
              )}
              <p className="text-xs text-text-secondary">
                How far in advance customers must book
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservationLeadTimeMax">
                Maximum Lead Time (days)
              </Label>
              <Input
                id="reservationLeadTimeMax"
                {...register('reservationLeadTimeMax', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full"
              />
              {errors.reservationLeadTimeMax && (
                <p className="text-sm text-red-600">
                  {errors.reservationLeadTimeMax.message}
                </p>
              )}
              <p className="text-xs text-text-secondary">
                How far in advance customers can book
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}
