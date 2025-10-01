'use server'

import { getTranslations } from 'next-intl/server'
import { getRestaurantBySlug } from '@/lib/queries/restaurant'
import {
  formatOpeningHours,
  formatTimeRange,
  isRestaurantOpen,
} from '@/lib/utils/opening-hours'
import { ReservationForm } from '@/components/reservation/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReservationPageProps {
  params: Promise<{
    restaurantSlug: string
  }>
}

export default async function ReservationPage({
  params,
}: ReservationPageProps) {
  const { restaurantSlug } = await params
  const tUi = await getTranslations('ui')
  const t = await getTranslations()

  // Fetch restaurant data
  const { restaurant, error } = await getRestaurantBySlug(restaurantSlug)

  // Handle error states
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {tUi('restaurantNotFound')}
          </h1>
          <p className="text-text-secondary">
            {error === 'Restaurant not found'
              ? tUi('restaurantNotFoundMessage', { restaurantSlug })
              : tUi('errorLoadingRestaurant')}
          </p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {tUi('loading')}
          </h1>
          <p className="text-text-secondary">{tUi('loadingRestaurantInfo')}</p>
        </div>
      </div>
    )
  }

  const openingHours = formatOpeningHours(restaurant.openingHours)
  const isOpen = isRestaurantOpen(restaurant.openingHours)
  const leadTimeMin = formatTimeRange(restaurant.reservationLeadTimeMin)
  const leadTimeMax = formatTimeRange(restaurant.reservationLeadTimeMax)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Restaurant Header - Full Width */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {restaurant.name}
        </h1>
        <p className="text-text-secondary">
          {tUi('makeReservation', { restaurantName: restaurant.name })}
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isOpen ? tUi('openNow') : tUi('closed')}
          </span>
          {restaurant.subscriptionStatus !== 'active' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {tUi('limitedService')}
            </span>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Reservation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                <h2>
                  {tUi('makeReservation', { restaurantName: restaurant.name })}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReservationForm
                restaurantId={restaurant.id}
                restaurantSlug={restaurant.slug}
                minGuests={restaurant.minGuestsPerReservation}
                maxGuests={restaurant.maxGuestsPerReservation}
                openingHours={restaurant.openingHours}
                leadTimeMin={restaurant.reservationLeadTimeMin}
                leadTimeMax={restaurant.reservationLeadTimeMax}
                turnstileSiteKey={
                  process.env.NEXT_PUBLIC_TURNSTYLE_SITE_KEY || ''
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Restaurant Information */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  <h2>{tUi('restaurantInformation')}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-medium text-text-dark mb-2">
                      {tUi('contact')}
                    </h3>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <p>
                        {tUi('email')}:{' '}
                        <a
                          href={`mailto:${restaurant.emailContact}`}
                          className="underline hover:text-primary/80"
                        >
                          {restaurant.emailContact}
                        </a>
                      </p>
                      {restaurant.phoneContact && (
                        <p>
                          {tUi('phone')}:{' '}
                          <a
                            href={`tel:${restaurant.phoneContact}`}
                            className="underline hover:text-primary/80"
                          >
                            {restaurant.phoneContact}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reservation Settings */}
                  <div>
                    <h3 className="font-medium text-text-dark mb-2">
                      {tUi('reservationDetails')}
                    </h3>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <p>
                        {t('restaurant.partySize', {
                          min: restaurant.minGuestsPerReservation,
                          max: restaurant.maxGuestsPerReservation,
                        })}
                      </p>
                      <p>
                        {t('restaurant.timeSlots', {
                          interval: restaurant.slotInterval,
                        })}
                      </p>
                      <p>
                        {t('restaurant.advanceBooking', {
                          min: leadTimeMin,
                          max: leadTimeMax,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h3 className="font-medium text-text-dark mb-2">
                      {tUi('openingHours')}
                    </h3>
                    <div className="space-y-1 text-sm text-text-secondary">
                      {openingHours.map((hours, index) => (
                        <p key={index}>{hours}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
