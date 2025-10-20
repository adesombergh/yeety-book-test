import { auth } from '@clerk/nextjs/server'
import { notFound, forbidden } from 'next/navigation'
import { verifyRestaurantAccess } from '@/lib/auth/restaurant-access'
import { ReactNode } from 'react'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { checkBillingInfoComplete } from '@/lib/queries/stripe-billing'

interface RestaurantLayoutProps {
  children: ReactNode
  params: Promise<{
    restaurantId: string
  }>
}

export default async function RestaurantLayout({
  children,
  params,
}: RestaurantLayoutProps) {
  const { userId } = await auth()

  // This should never happen due to middleware, but adding as safety check
  if (!userId) {
    forbidden()
  }

  const { restaurantId } = await params

  const accessResult = await verifyRestaurantAccess(userId, restaurantId)

  if (!accessResult.hasAccess) {
    if (accessResult.error === 'NOT_FOUND') {
      notFound()
    } else {
      forbidden()
    }
  }

  // Fetch billing completion status from Stripe
  const billingInfoComplete = await checkBillingInfoComplete(
    accessResult.restaurant?.stripeCustomerId || null
  )

  return (
    <DashboardLayout
      currentRestaurant={accessResult.restaurant}
      billingInfoComplete={billingInfoComplete}
    >
      {children}
    </DashboardLayout>
  )
}
