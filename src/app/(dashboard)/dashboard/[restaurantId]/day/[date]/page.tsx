import { getTranslations } from 'next-intl/server'

interface DayViewPageProps {
  params: Promise<{
    restaurantId: string
    date: string
  }>
}

export default async function DayViewPage({ params }: DayViewPageProps) {
  const { restaurantId, date } = await params
  const t = await getTranslations('dashboard.dayView')

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">
        {t('subtitle', { date: date })}
      </p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          {t('dayViewFor')}{' '}
          <span className="font-mono text-primary">{restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          {t('date')} <span className="font-mono text-primary">{date}</span>
        </p>
      </div>
    </div>
  )
}
