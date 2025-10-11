import { getTranslations } from 'next-intl/server'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardCalendar } from '@/components/dashboard/calendar'
import { getUserRestaurantById } from '@/lib/queries/user-restaurant'
import { CalendarActions } from '@/components/dashboard/calendar-actions'

interface CalendarPageProps {
  params: Promise<{
    restaurantId: string
  }>
}

export default async function CalendarPage({ params }: CalendarPageProps) {
  const t = await getTranslations('dashboard.calendar')
  const { userId } = await auth()
  const { restaurantId } = await params

  if (!userId) {
    redirect('/sign-in')
  }

  // Fetch restaurant data
  const { restaurant, error } = await getUserRestaurantById(
    userId,
    restaurantId
  )

  if (error || !restaurant) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
        <p className="text-text-secondary mt-2">{t('subtitle')}</p>

        <div className="mt-8 p-6 border border-border rounded-lg bg-background">
          <p className="text-red-600">{error || 'Restaurant not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
          <p className="text-text-secondary mt-2">{t('subtitle')}</p>
        </div>
        <CalendarActions restaurantSlug={restaurant.slug} />
      </div>

      <div className="mt-8">
        {restaurant.openingHours ? (
          <DashboardCalendar
            restaurantId={restaurantId}
            openingHours={restaurant.openingHours}
            timeSlotInterval={restaurant.slotInterval}
          />
        ) : (
          <p>
            Ce restaurant n'est pas encore configuré.
            <br />
            Veuillez déterminer les heures d'ouverure dans l'onglet
            configuration
          </p>
        )}
      </div>
    </div>
  )
}
