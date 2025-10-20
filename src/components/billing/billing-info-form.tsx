'use client'

import { useState, useEffect } from 'react'
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
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const billingInfoSchema = z.object({
  name: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  vatNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        return /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(val.trim())
      },
      { message: 'Numéro de TVA invalide (ex: BE0123456789)' }
    ),
})

type BillingInfoFormData = z.infer<typeof billingInfoSchema>

interface BillingInfoFormProps {
  restaurantId: string
}

export function BillingInfoForm({ restaurantId }: BillingInfoFormProps) {
  const t = useTranslations('dashboard.billing')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<BillingInfoFormData>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      name: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      vatNumber: '',
    },
  })

  // Fetch billing info from Stripe on mount
  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const response = await fetch(
          `/api/stripe/billing-info?restaurantId=${restaurantId}`
        )
        const data = await response.json()

        if (response.ok) {
          form.reset({
            name: data.name || '',
            addressLine1: data.address?.line1 || '',
            addressLine2: data.address?.line2 || '',
            postalCode: data.address?.postal_code || '',
            city: data.address?.city || '',
            vatNumber: data.vatNumber || '',
          })
        } else {
          console.error('Failed to fetch billing info:', data.error)
        }
      } catch (error) {
        console.error('Error fetching billing info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingInfo()
  }, [restaurantId, form])

  const onSubmit = async (values: BillingInfoFormData) => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/stripe/billing-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          name: values.name,
          address: {
            line1: values.addressLine1,
            line2: values.addressLine2,
            postal_code: values.postalCode,
            city: values.city,
          },
          vatNumber: values.vatNumber,
        }),
      })

      if (response.ok) {
        toast.success(t('billingInfoSaved'))
      } else {
        const data = await response.json()
        toast.error(data.error || t('billingInfoError'))
      }
    } catch (error) {
      console.error('Error saving billing info:', error)
      toast.error(t('billingInfoError'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-text-secondary">{t('loadingBillingInfo')}</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('companyName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('companyNamePlaceholder')}
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addressLine1')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('addressLine1Placeholder')}
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addressLine2')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('addressLine2Placeholder')}
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('postalCode')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('postalCodePlaceholder')}
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('city')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('cityPlaceholder')}
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>{t('country')}</FormLabel>
          <Input value="Belgique" disabled className="mt-2" />
        </div>

        <FormField
          control={form.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vatNumberOptional')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('vatNumberPlaceholder')}
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? t('savingBillingInfo') : t('saveBillingInfo')}
        </Button>
      </form>
    </Form>
  )
}
