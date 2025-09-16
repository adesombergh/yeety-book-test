import { getTranslations } from 'next-intl/server'

interface BillingPageProps {
  params: Promise<{
    restaurantId: string
  }>
}

export default async function BillingPage({ params }: BillingPageProps) {
  const t = await getTranslations('dashboard.billing')
  const { restaurantId } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">{t('subtitle')}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Billing for restaurant:{' '}
          <span className="font-mono text-primary">{restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will contain subscription management, payment methods,
          billing history, and invoice downloads.
        </p>
      </div>
    </div>
  )
}
