import { getTranslations } from 'next-intl/server'
import { getReservationByCancelToken } from '@/lib/queries/reservation-cancel'
import { ReservationCancelForm } from '@/components/reservation/cancel-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ReservationCancelPageProps {
  params: Promise<{
    restaurantSlug: string
    token: string
  }>
}

export default async function ReservationCancelPage({
  params,
}: ReservationCancelPageProps) {
  const { token } = await params
  const t = await getTranslations('reservation.cancel')

  // Fetch reservation data using the cancel token
  const { reservation, error } = await getReservationByCancelToken(token)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">{t('title')}</h1>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {error ? (
        // Show error state
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
              {t('error.unableToCancel')}
            </CardTitle>
            <CardDescription className="text-red-700">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-red-600 mb-4">
              {t('error.contactRestaurant')}
            </p>
          </CardContent>
        </Card>
      ) : reservation ? (
        // Show cancellation form
        <ReservationCancelForm reservation={reservation} />
      ) : (
        // Loading state (shouldn't happen with server components, but just in case)
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange mx-auto mb-4"></div>
            <p className="text-text-secondary">{t('loading')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
