'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ReservationCancelData } from '@/lib/queries/reservation-cancel'

interface ReservationCancelFormProps {
  reservation: ReservationCancelData
  restaurantSlug?: string
}

interface CancelResponse {
  success: boolean
  error?: string
  reservation?: {
    id: number
    firstName: string
    lastName: string
    email: string
    date: Date
    guests: number
    status: string
    restaurant: {
      name: string
      slug: string
      emailContact: string
    }
    cancelledAt: Date | null
  }
}

export function ReservationCancelForm({
  reservation,
}: ReservationCancelFormProps) {
  const t = useTranslations('reservation.cancel')
  const tErrors = useTranslations('errors')
  const tCommon = useTranslations('common')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CancelResponse | null>(null)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date))
  }

  const handleCancelReservation = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/reservations/cancel', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelToken: reservation.cancelToken,
          reason: reason.trim() || undefined,
        }),
      })

      const data: CancelResponse = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      setResult({
        success: false,
        error: t('error.failed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show success message
  if (result?.success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-green-800">{t('success.title')}</CardTitle>
          <CardDescription className="text-green-700">
            {t('success.message')}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Show error message
  if (result?.error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <CardTitle className="text-red-800">
            {tErrors('cancellationFailed')}
          </CardTitle>
          <CardDescription className="text-red-700">
            {result.error}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            variant="outline"
            onClick={() => setResult(null)}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            {tErrors('tryAgain')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show confirmation dialog
  if (showConfirmation) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-accent-red">{t('confirmTitle')}</CardTitle>
          <CardDescription>{t('confirmMessage')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reservation Details Summary */}
          <div className="bg-surface-light rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-text-dark">
              {t('details.reservationFor', {
                name: `${reservation.firstName} ${reservation.lastName}`,
              })}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">
                  {t('details.date')}:
                </span>
                <p className="font-medium">{formatDate(reservation.date)}</p>
              </div>
              <div>
                <span className="text-text-secondary">
                  {t('details.time')}:
                </span>
                <p className="font-medium">{formatTime(reservation.date)}</p>
              </div>
              <div>
                <span className="text-text-secondary">
                  {t('details.guests')}:
                </span>
                <p className="font-medium">
                  {reservation.guests}{' '}
                  {reservation.guests === 1 ? 'guest' : 'guests'}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">
                  {t('details.restaurant')}:
                </span>
                <p className="font-medium">{reservation.restaurant.name}</p>
              </div>
            </div>
          </div>

          {/* Optional Cancellation Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">{t('reasonLabel')}</Label>
            <Textarea
              id="reason"
              placeholder={t('reasonPlaceholder')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
              className="flex-1"
            >
              {t('cancelButton')}
            </Button>
            <Button
              onClick={handleCancelReservation}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              {isLoading ? t('cancelling') : t('confirmButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show initial reservation details
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reservation Details */}
        <div className="bg-surface-light rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-dark">
            {t('details.reservationFor', {
              name: `${reservation.firstName} ${reservation.lastName}`,
            })}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-text-secondary">
                  {t('details.date')}
                </span>
                <p className="font-medium text-text-dark">
                  {formatDate(reservation.date)}
                </p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">
                  {t('details.time')}
                </span>
                <p className="font-medium text-text-dark">
                  {formatTime(reservation.date)}
                </p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">
                  {t('details.guests')}
                </span>
                <p className="font-medium text-text-dark">
                  {reservation.guests}{' '}
                  {reservation.guests === 1 ? 'guest' : 'guests'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-text-secondary">
                  {t('details.restaurant')}
                </span>
                <p className="font-medium text-text-dark">
                  {reservation.restaurant.name}
                </p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">
                  {t('details.contact')}
                </span>
                <p className="font-medium text-text-dark">
                  {reservation.restaurant.emailContact}
                </p>
              </div>
            </div>
          </div>

          {reservation.notes && (
            <div>
              <span className="text-sm text-text-secondary">
                {tCommon('specialRequests')}
              </span>
              <p className="font-medium text-text-dark">{reservation.notes}</p>
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowConfirmation(true)}
            variant="destructive"
          >
            {t('title')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
