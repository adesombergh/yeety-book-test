'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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

  const form = useForm<RestaurantSettingsFormData>({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text-dark mb-4">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter restaurant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="restaurant-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in your booking URL:
                      yoursite.com/restaurant-slug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emailContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@restaurant.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                const isClosed = form.watch(`openingHours.${dayKey}.closed`)

                return (
                  <div key={day.key} className="flex items-center gap-4 h-9">
                    <div className="w-24">
                      <Label className="font-medium">{day.label}</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`openingHours.${dayKey}.closed`}
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
                          <Label
                            htmlFor={`${day.key}-open`}
                            className="text-sm"
                          >
                            Open:
                          </Label>
                          <FormField
                            control={form.control}
                            name={`openingHours.${dayKey}.open`}
                            render={({ field }) => (
                              <Input
                                id={`${day.key}-open`}
                                type="time"
                                className="w-32"
                                {...field}
                              />
                            )}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`${day.key}-close`}
                            className="text-sm"
                          >
                            Close:
                          </Label>
                          <FormField
                            control={form.control}
                            name={`openingHours.${dayKey}.close`}
                            render={({ field }) => (
                              <Input
                                id={`${day.key}-close`}
                                type="time"
                                className="w-32"
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
            {form.formState.errors.openingHours && (
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
              <FormField
                control={form.control}
                name="minGuestsPerReservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxGuestsPerReservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxReservationsPerSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Reservations per Slot</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="slotInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot Interval</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SLOT_INTERVALS.map((interval) => (
                          <SelectItem
                            key={interval.value}
                            value={interval.value}
                          >
                            {interval.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationLeadTimeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Lead Time (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      How far in advance customers must book
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationLeadTimeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Lead Time (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      How far in advance customers can book
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
    </Form>
  )
}
