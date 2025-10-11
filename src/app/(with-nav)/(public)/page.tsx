import { getAllRestaurants } from '@/lib/queries/restaurant'
import { RestaurantCard } from '@/components/restaurant/card'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations()
  const { restaurants, error } = await getAllRestaurants()

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark">
            {t('homepage.welcome')}
          </h1>
          <p className="text-text-secondary mt-2">
            {t('homepage.findAndBook')}
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            {t('homepage.unableToLoad')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark">
          {t('homepage.welcome')}
        </h1>
        <p className="text-text-secondary mt-2">{t('homepage.findAndBook')}</p>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            {t('homepage.noRestaurantsAvailable')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  )
}
