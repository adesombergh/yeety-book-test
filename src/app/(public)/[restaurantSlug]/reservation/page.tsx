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
  const t = await getTranslations('ui')

  // Fetch restaurant data
  const { restaurant, error } = await getRestaurantBySlug(restaurantSlug)

  // Handle error states
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('restaurantNotFound')}
          </h1>
          <p className="text-text-secondary">
            {error === 'Restaurant not found'
              ? t('restaurantNotFoundMessage', { restaurantSlug })
              : t('errorLoadingRestaurant')}
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
            {t('loading')}
          </h1>
          <p className="text-text-secondary">{t('loadingRestaurantInfo')}</p>
        </div>
      </div>
    )
  }

  const openingHours = formatOpeningHours(restaurant.openingHours)
  const isOpen = isRestaurantOpen(restaurant.openingHours)
  const leadTimeMin = formatTimeRange(restaurant.reservationLeadTimeMin)
  const leadTimeMax = formatTimeRange(restaurant.reservationLeadTimeMax)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {restaurant.name}
        </h1>
        <p className="text-text-secondary">
          {t('makeReservation', { restaurantName: restaurant.name })}
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isOpen ? t('openNow') : t('closed')}
          </span>
          {restaurant.subscriptionStatus !== 'active' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {t('limitedService')}
            </span>
          )}
        </div>
      </div>

      {/* Restaurant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <h2>{t('restaurantInformation')}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-medium text-text-dark mb-2">
                {t('contact')}
              </h3>
              <div className="space-y-1 text-sm text-text-secondary">
                <p>{t('emailLabel', { email: restaurant.emailContact })}</p>
                {restaurant.phoneContact && (
                  <p>{t('phoneLabel', { phone: restaurant.phoneContact })}</p>
                )}
              </div>
            </div>

            {/* Reservation Settings */}
            <div>
              <h3 className="font-medium text-text-dark mb-2">
                {t('reservationDetails')}
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
          </div>

          {/* Opening Hours */}
          <div className="mt-6">
            <h3 className="font-medium text-text-dark mb-2">
              {t('openingHours')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-1 text-sm text-text-secondary">
              {openingHours.map((hours, index) => (
                <p key={index}>{hours}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservation Form */}
      <Card>
        <CardContent>
          <ReservationForm
            restaurantId={restaurant.id}
            restaurantSlug={restaurant.slug}
            minGuests={restaurant.minGuestsPerReservation}
            maxGuests={restaurant.maxGuestsPerReservation}
            slotInterval={restaurant.slotInterval}
            openingHours={restaurant.openingHours}
            leadTimeMin={restaurant.reservationLeadTimeMin}
            leadTimeMax={restaurant.reservationLeadTimeMax}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTYLE_SITE_KEY || ''}
          />
        </CardContent>
      </Card>
    </div>
  )
}
