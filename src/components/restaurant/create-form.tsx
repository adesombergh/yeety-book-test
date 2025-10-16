'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createRestaurant } from '@/lib/actions/restaurant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required').max(100),
  vatNumber: z
    .string()
    .min(1, 'VAT number is required')
    .regex(
      /^[A-Z]{2}[0-9A-Z]{2,12}$/,
      'Numéro de TVA invalide (ex: BE0123456789)'
    ),
})

export function RestaurantCreateForm() {
  const router = useRouter()
  const t = useTranslations('dashboard.home')

  const tWizard = useTranslations('wizard')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof createRestaurantSchema>>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: { name: '', vatNumber: '' },
  })

  async function onSubmit(values: z.infer<typeof createRestaurantSchema>) {
    setIsSubmitting(true)
    setError(null)

    const result = await createRestaurant(values.name, values.vatNumber)
    if (result.checkoutUrl && result.restaurantId) {
      window.location.href = result.checkoutUrl
      // Redirect to settings page on success
      // router.push(`/dashboard/${result.restaurantId}/settings`)
    } else {
      setError(result.error || 'Failed to create restaurant')
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-24 justify-center items-center text-center  flex-1 h-full"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-text-dark">
            {tWizard('title')}
          </h1>
          <p className="text-text-secondary mt-2">{tWizard('subtitle')}</p>
        </div>

        <div className="max-w-md w-full space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('createFirstRestaurant.nameLabel')}</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    placeholder={t('createFirstRestaurant.namePlaceholder')}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tWizard('vatNumberLabel')}</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    placeholder={tWizard('vatNumberPlaceholder')}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                {/* <p className="text-xs text-text-secondary">
                  {tWizard('vatNumberHelp')}
                </p> */}
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-text-secondary text-center max-w-md">
            {tWizard('legalDisclaimer')}
          </p>
          <Button className="h-12 px-8" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('createFirstRestaurant.creating')
              : t('createFirstRestaurant.createButton')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
