import { Restaurant } from '@prisma/client'
import { RestaurantProgress } from './restaurant-progress'
import { checkBillingInfoComplete } from '@/lib/queries/stripe-billing'

interface RestaurantProgressWrapperProps {
  restaurant: Restaurant | null
}

export async function RestaurantProgressWrapper({
  restaurant,
}: RestaurantProgressWrapperProps) {
  if (!restaurant) return null

  // Fetch billing completion status from Stripe
  const billingInfoComplete = await checkBillingInfoComplete(
    restaurant.stripeCustomerId
  )

  return (
    <RestaurantProgress
      restaurant={restaurant}
      billingInfoComplete={billingInfoComplete}
    />
  )
}
