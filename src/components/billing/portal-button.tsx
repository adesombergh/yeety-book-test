'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BillingPortalButtonProps {
  restaurantId: string
}

export function BillingPortalButton({
  restaurantId,
}: BillingPortalButtonProps) {
  const t = useTranslations('dashboard.billing')
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenPortal = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No portal URL returned')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleOpenPortal} disabled={isLoading} className="gap-2">
      <ExternalLink className="h-4 w-4" />
      {isLoading ? t('loadingPortal') : t('openPortal')}
    </Button>
  )
}
