import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { DashboardRestaurantCard } from '@/components/dashboard/restaurant-card'
import { Button } from '@/components/ui/button'
import { RestaurantWithTypedHours } from '@/lib/types/restaurant'

export const DashboardListContent = ({
  restaurants,
  error,
}: {
  restaurants: RestaurantWithTypedHours[]
  error: string | null
}) => {
  const t = useTranslations('dashboard.home')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
        <p className="text-text-secondary mt-2">{t('subtitle')}</p>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="p-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-800 font-medium">
              {t('errorLoadingRestaurants')}
            </p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <DashboardRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/wizard">
                <Button variant="outline" size="lg">
                  {t('createNewRestaurant')}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
