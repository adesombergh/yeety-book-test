import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getUserRestaurants } from '@/lib/queries/user-restaurant'
import { DashboardListContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  // Get the current user from Clerk
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch user's restaurants
  const { restaurants, error } = await getUserRestaurants(user.id)

  // Handle auto-redirects based on restaurant count
  // if (!error) {
  //   if (restaurants.length === 0) {
  //     // Redirect to wizard for first-time setup
  //     redirect('/wizard')
  //   } else if (restaurants.length === 1) {
  //     // Auto-redirect for single restaurant users
  //     redirect(`/dashboard/${restaurants[0].id}/calendar`)
  //   }
  // }

  return <DashboardListContent restaurants={restaurants} error={error} />
}
