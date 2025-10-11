'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createRestaurant } from '@/lib/actions/restaurant'

const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required').max(100),
})

export function RestaurantCreateForm() {
  const router = useRouter()
  const t = useTranslations('dashboard.home')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof createRestaurantSchema>>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: { name: '' },
  })

  async function onSubmit(values: z.infer<typeof createRestaurantSchema>) {
    setIsSubmitting(true)
    setError(null)

    const result = await createRestaurant(values.name)

    if (result.success && result.restaurantId) {
      // Redirect to settings page on success
      router.push(`/dashboard/${result.restaurantId}/settings`)
    } else {
      setError(result.error || 'Failed to create restaurant')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-8 border border-border rounded-xl bg-background">
        <h2 className="text-2xl font-bold text-text-dark mb-2">
          {t('createFirstRestaurant.title')}
        </h2>
        <p className="text-text-secondary mb-6">
          {t('createFirstRestaurant.description')}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createFirstRestaurant.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('createFirstRestaurant.namePlaceholder')}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? t('createFirstRestaurant.creating')
                : t('createFirstRestaurant.createButton')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
