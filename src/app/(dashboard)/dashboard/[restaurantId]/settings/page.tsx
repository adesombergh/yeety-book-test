import { getTranslations } from 'next-intl/server'
import { RestaurantSettingsForm } from '@/components/ui/restaurant-settings-form'

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

      <div className="mt-8">
        <RestaurantSettingsForm restaurantId={restaurantId} />
      </div>
    </div>
  )
}
