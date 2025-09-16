import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { useTranslations } from 'next-intl'
import { getUserRestaurants } from '@/lib/queries/user-restaurant'
import { DashboardRestaurantCard } from '@/components/ui/dashboard-restaurant-card'
import { RestaurantWithTypedHours } from '@/lib/types/restaurant'

export default async function DashboardPage() {
  // Get the current user from Clerk
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch user's restaurants
  const { restaurants, error } = await getUserRestaurants(user.id)

  // Handle auto-redirect for single restaurant users
  if (!error && restaurants.length === 1) {
    redirect(`/dashboard/${restaurants[0].id}/calendar`)
  }

  return <DashboardContent restaurants={restaurants} error={error} />
}

function DashboardContent({
  restaurants,
  error,
}: {
  restaurants: RestaurantWithTypedHours[]
  error: string | null
}) {
  const t = useTranslations('dashboard.home')

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">{t('subtitle')}</p>

      <div className="mt-8">
        {error ? (
          <div className="p-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-800 font-medium">
              {t('errorLoadingRestaurants')}
            </p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="p-6 border border-border rounded-lg bg-background text-center">
            <h3 className="text-lg font-medium text-text-dark mb-2">
              {t('noRestaurants')}
            </h3>
            <p className="text-text-secondary">
              {t('noRestaurantsDescription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <DashboardRestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
