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
import Image from 'next/image'

interface ReservationPageProps {
  params: Promise<{
    restaurantSlug: string
  }>
}

export default async function ReservationPage({
  params,
}: ReservationPageProps) {
  const { restaurantSlug } = await params
  const t = await getTranslations()

  // Fetch restaurant data
  const { restaurant, error } = await getRestaurantBySlug(restaurantSlug)

  // Handle error states
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('ui.restaurantNotFound')}
          </h1>
          <p className="text-text-secondary">
            {error === 'Restaurant not found'
              ? t('ui.restaurantNotFoundMessage', { restaurantSlug })
              : t('ui.errorLoadingRestaurant')}
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
            {t('ui.loading')}
          </h1>
          <p className="text-text-secondary">{t('ui.loadingRestaurantInfo')}</p>
        </div>
      </div>
    )
  }

  const openingHours = formatOpeningHours(restaurant.openingHours)
  const isOpen = isRestaurantOpen(restaurant.openingHours)
  const leadTimeMin = formatTimeRange(restaurant.reservationLeadTimeMinHours)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Restaurant Header - Full Width */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          {restaurant.logoUrl ? (
            <Image
              src={restaurant.logoUrl}
              alt={`${restaurant.name} logo`}
              className="h-16 w-16 rounded-lg object-cover"
              width={64}
              height={64}
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-accent-pink/20 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {restaurant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-text-dark">
            {restaurant.name}
          </h1>
        </div>
        <p className="text-text-secondary">
          {t('ui.makeReservation', { restaurantName: restaurant.name })}
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isOpen ? t('ui.openNow') : t('ui.closed')}
          </span>
          {restaurant.subscriptionStatus !== 'active' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {t('ui.limitedService')}
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
                  {t('ui.makeReservation', { restaurantName: restaurant.name })}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {restaurant.openingHours ? (
                <ReservationForm
                  restaurantId={restaurant.id}
                  restaurantSlug={restaurant.slug}
                  minGuests={restaurant.minGuestsPerReservation}
                  maxGuests={restaurant.maxGuestsPerReservation}
                  openingHours={restaurant.openingHours}
                  leadTimeMinHours={restaurant.reservationLeadTimeMinHours}
                  leadTimeMaxHours={restaurant.reservationLeadTimeMaxHours}
                  turnstileSiteKey={
                    process.env.NEXT_PUBLIC_TURNSTYLE_SITE_KEY || ''
                  }
                />
              ) : (
                <p>{t('reservation.restaurantNotConfiguredShort')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Restaurant Information */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  <h2>{t('ui.restaurantInformation')}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Contact Information */}
                  {restaurant.emailContact ||
                    (restaurant.phoneContact && (
                      <div>
                        <h3 className="font-medium text-text-dark mb-2">
                          {t('ui.contact')}
                        </h3>
                        <div className="space-y-1 text-sm text-text-secondary">
                          {restaurant.emailContact && (
                            <p>
                              {t('ui.email')}:{' '}
                              <a
                                href={`mailto:${restaurant.emailContact}`}
                                className="underline hover:text-primary/80"
                              >
                                {restaurant.emailContact}
                              </a>
                            </p>
                          )}
                          {restaurant.phoneContact && (
                            <p>
                              {t('ui.phone')}:{' '}
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
                    ))}

                  {/* Reservation Settings */}
                  <div>
                    <h3 className="font-medium text-text-dark mb-2">
                      {t('ui.reservationDetails')}
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
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  {restaurant.openingHours && (
                    <div>
                      <h3 className="font-medium text-text-dark mb-2">
                        {t('ui.openingHours')}
                      </h3>
                      <div className="space-y-1 text-sm text-text-secondary">
                        {openingHours.map((hours, index) => (
                          <p key={index}>{hours}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
