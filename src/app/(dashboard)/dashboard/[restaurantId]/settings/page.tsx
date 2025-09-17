import { getTranslations } from 'next-intl/server'

interface SettingsPageProps {
  params: Promise<{
    restaurantId: string
  }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { restaurantId } = await params
  const t = await getTranslations('dashboard.settings')

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">{t('subtitle')}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Settings for restaurant:{' '}
          <span className="font-mono text-primary">{restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will contain restaurant configuration options, business
          hours, table management, and other preferences.
        </p>
      </div>
    </div>
  )
}
