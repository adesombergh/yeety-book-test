import { getTranslations } from 'next-intl/server'

interface ReservationDetailPageProps {
  params: Promise<{
    restaurantId: string
    id: string
  }>
}

export default async function ReservationDetailPage({
  params,
}: ReservationDetailPageProps) {
  const { restaurantId, id } = await params
  const t = await getTranslations('dashboard.reservationDetail')

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">{t('subtitle', { id: id })}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Reservation detail for restaurant:{' '}
          <span className="font-mono text-primary">{restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          Reservation ID: <span className="font-mono text-primary">{id}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will display detailed information and management options for
          a specific reservation.
        </p>
      </div>
    </div>
  )
}
