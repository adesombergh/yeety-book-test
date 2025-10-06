'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface CalendarActionsProps {
  restaurantSlug: string
}

export function CalendarActions({ restaurantSlug }: CalendarActionsProps) {
  const t = useTranslations('dashboard.calendar')
  const reservationUrl = `${window.location.origin}/${restaurantSlug}/reservation`

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(reservationUrl)
      toast.success(t('linkCopied'))
    } catch {
      toast.error(t('unableToCopyLink'))
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(reservationUrl, '_blank')}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        {t('visitReservationPage')}
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        {t('share')}
      </Button>
    </div>
  )
}
