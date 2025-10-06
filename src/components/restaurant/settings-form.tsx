'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Plus, Trash2 } from 'lucide-react'
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

export function RestaurantSettingsForm({
  restaurantId,
  initialData,
}: RestaurantSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const t = useTranslations('restaurant.settings')
  const tCommon = useTranslations('common')
  const tForms = useTranslations('forms')

  const DAYS_OF_WEEK = [
    { key: 'monday', label: t('days.monday') },
    { key: 'tuesday', label: t('days.tuesday') },
    { key: 'wednesday', label: t('days.wednesday') },
    { key: 'thursday', label: t('days.thursday') },
    { key: 'friday', label: t('days.friday') },
    { key: 'saturday', label: t('days.saturday') },
    { key: 'sunday', label: t('days.sunday') },
  ]

  const SLOT_INTERVALS = [
    { value: '15', label: t('slotIntervals.15') },
    { value: '30', label: t('slotIntervals.30') },
    { value: '60', label: t('slotIntervals.60') },
  ]

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
      reservationLeadTimeMinHours: initialData.reservationLeadTimeMinHours,
      reservationLeadTimeMaxHours: initialData.reservationLeadTimeMaxHours,
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
                {t('basicInformation')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('restaurantName')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tForms('enterRestaurantName')}
                        {...field}
                      />
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
                    <FormLabel>{t('urlSlug')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tForms('restaurantSlugPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t('urlSlugDescription')}</FormDescription>
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
                    <FormLabel>{t('contactEmail')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={tForms('contactEmailPlaceholder')}
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
                    <FormLabel>{t('contactPhone')}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={tForms('contactPhonePlaceholder')}
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
                {t('openingHours')}
              </h2>
              <p className="text-text-secondary">
                {t('openingHoursDescription')}
              </p>
            </div>

            <div className="space-y-6">
              {DAYS_OF_WEEK.map((day) => {
                const dayKey =
                  day.key as keyof RestaurantSettingsFormData['openingHours']
                const isClosed = form.watch(`openingHours.${dayKey}.closed`)

                return (
                  <DayScheduleField
                    key={day.key}
                    dayKey={dayKey}
                    dayLabel={day.label}
                    form={form}
                    isClosed={isClosed}
                    t={t}
                  />
                )
              })}
            </div>
            {form.formState.errors.openingHours && (
              <p className="text-sm text-red-600">{t('openingHoursError')}</p>
            )}
          </div>
        </Card>

        {/* Reservation Constraints Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text-dark mb-4">
                {t('reservationSettings')}
              </h2>
              <p className="text-text-secondary">
                {t('reservationSettingsDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="minGuestsPerReservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minimumGuests')}</FormLabel>
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
                    <FormLabel>{t('maximumGuests')}</FormLabel>
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
                    <FormLabel>{t('maxReservationsPerSlot')}</FormLabel>
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
                    <FormLabel>{t('timeSlotInterval')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tForms('selectInterval')} />
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
                name="reservationLeadTimeMinHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minimumLeadTimeHours')}</FormLabel>
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
                      {t('minimumLeadTimeDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationLeadTimeMaxHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maximumLeadTimeDays')}</FormLabel>
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
                      {t('maximumLeadTimeDescription')}
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
          <Button
            type="button"
            variant="input"
            disabled={isSaving}
            onClick={() => form.reset()}
          >
            {tForms('cancel')}
          </Button>
          <Button type="submit" variant="default" disabled={isSaving}>
            {isSaving ? tCommon('saving') : tCommon('saveSettings')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Separate component for each day's schedule to handle field array
function DayScheduleField({
  dayKey,
  dayLabel,
  form,
  isClosed,
  t,
}: {
  dayKey: keyof RestaurantSettingsFormData['openingHours']
  dayLabel: string
  form: ReturnType<typeof useForm<RestaurantSettingsFormData>>
  isClosed: boolean
  t: ReturnType<typeof useTranslations>
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `openingHours.${dayKey}.periods`,
  })

  const handleClosedChange = (checked: boolean) => {
    form.setValue(`openingHours.${dayKey}.closed`, checked)
    if (checked) {
      // Clear all periods when marking as closed
      form.setValue(`openingHours.${dayKey}.periods`, [])
    }
  }

  const handleAddPeriod = () => {
    append({ open: '09:00', close: '17:00' })
  }

  return (
    <div className="space-y-3 border-b border-border-light pb-4 last:border-0">
      <div className="flex items-center justify-between">
        <Label className="font-medium text-base">{dayLabel}</Label>
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`openingHours.${dayKey}.closed`}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${dayKey}-closed`}
                  checked={field.value}
                  onCheckedChange={handleClosedChange}
                />
                <Label htmlFor={`${dayKey}-closed`} className="text-sm">
                  {t('closed')}
                </Label>
              </div>
            )}
          />
        </div>
      </div>

      {!isClosed && (
        <div className="space-y-2 pl-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm w-10">{t('open')}</Label>
                <FormField
                  control={form.control}
                  name={`openingHours.${dayKey}.periods.${index}.open`}
                  render={({ field }) => (
                    <Input type="time" className="w-32" {...field} />
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm w-10">{t('close')}</Label>
                <FormField
                  control={form.control}
                  name={`openingHours.${dayKey}.periods.${index}.close`}
                  render={({ field }) => (
                    <Input type="time" className="w-32" {...field} />
                  )}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPeriod}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('addPeriod') || 'Add Period'}
          </Button>
        </div>
      )}
    </div>
  )
}
