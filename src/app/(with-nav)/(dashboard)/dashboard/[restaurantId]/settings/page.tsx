import { getTranslations } from 'next-intl/server'
import { RestaurantSettingsForm } from '@/components/restaurant/settings-form'
import { getRestaurantById } from '@/lib/queries/restaurant'
import { notFound } from 'next/navigation'

interface SettingsPageProps {
  params: Promise<{
    restaurantId: string
  }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { restaurantId } = await params
  const t = await getTranslations('dashboard.settings')

  // Load restaurant data server-side
  const restaurantIdNum = parseInt(restaurantId, 10)
  if (isNaN(restaurantIdNum)) {
    notFound()
  }

  const { restaurant, error } = await getRestaurantById(restaurantIdNum)

  if (error || !restaurant) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">{t('subtitle')}</p>

      <div className="mt-8">
        <RestaurantSettingsForm
          restaurantId={restaurantId}
          initialData={restaurant}
        />
      </div>
    </div>
  )
}
