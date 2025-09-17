'use server'

import { getAllRestaurants } from '@/lib/queries/restaurant'
import { RestaurantCard } from '@/components/ui/restaurant-card'

export default async function HomePage() {
  const { restaurants, error } = await getAllRestaurants()

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark">
            Welcome to YeetyBook
          </h1>
          <p className="text-text-secondary mt-2">
            Find and book restaurant reservations
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            Unable to load restaurants. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark">
          Welcome to YeetyBook
        </h1>
        <p className="text-text-secondary mt-2">
          Find and book restaurant reservations
        </p>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            No restaurants available at the moment.
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
