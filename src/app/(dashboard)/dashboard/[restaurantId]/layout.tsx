import { auth } from '@clerk/nextjs/server'
import { notFound, forbidden } from 'next/navigation'
import { verifyRestaurantAccess } from '@/lib/auth/restaurant-access'
import { ReactNode } from 'react'
import { DashboardLayout } from '@/layouts/dashboard-layout'

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
    notFound()
  }

  // Await params to get the restaurantId
  const { restaurantId } = await params

  // Verify restaurant access
  const accessResult = await verifyRestaurantAccess(userId, restaurantId)

  if (!accessResult.hasAccess) {
    if (accessResult.error === 'NOT_FOUND') {
      notFound()
    } else {
      forbidden()
      // Render a forbidden page
      // return (
      //   <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      //     <div className="text-center">
      //       <h1 className="text-2xl font-bold text-text-dark mb-4">
      //         Access Forbidden
      //       </h1>
      //       <p className="text-text-secondary mb-6">
      //         You do not have permission to access this restaurant&apos;s dashboard.
      //       </p>
      //       <Link
      //         href="/dashboard"
      //         className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      //       >
      //         Return to Dashboard
      //       </Link>
      //     </div>
      //   </div>
      // )
    }
  }

  // Access granted - render children
  return <DashboardLayout>{children}</DashboardLayout>
}
