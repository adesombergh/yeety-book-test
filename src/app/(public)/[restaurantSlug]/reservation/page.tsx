'use server';

import { getTranslations } from 'next-intl/server';
import { getRestaurantBySlug } from '@/lib/queries/restaurant';
import { formatOpeningHours, formatTimeRange, isRestaurantOpen } from '@/lib/utils/opening-hours';

interface ReservationPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { restaurantSlug } = await params;
  const t = await getTranslations('reservation.form');

  // Fetch restaurant data
  const { restaurant, error } = await getRestaurantBySlug(restaurantSlug);

  // Handle error states
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Restaurant Not Found
          </h1>
          <p className="text-text-secondary">
            {error === 'Restaurant not found'
              ? `We couldn't find a restaurant with the name "${restaurantSlug}".`
              : 'There was an error loading the restaurant information. Please try again later.'
            }
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Loading...
          </h1>
          <p className="text-text-secondary">
            Loading restaurant information...
          </p>
        </div>
      </div>
    );
  }

  const openingHours = formatOpeningHours(restaurant.openingHours);
  const isOpen = isRestaurantOpen(restaurant.openingHours);
  const leadTimeMin = formatTimeRange(restaurant.reservationLeadTimeMin);
  const leadTimeMax = formatTimeRange(restaurant.reservationLeadTimeMax);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {restaurant.name}
        </h1>
        <p className="text-text-secondary">
          Make a reservation at {restaurant.name}
        </p>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isOpen
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
          {restaurant.subscriptionStatus !== 'active' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Limited Service
            </span>
          )}
        </div>
      </div>

      {/* Restaurant Information */}
      <div className="bg-surface-light rounded-lg p-6 border border-border-light mb-6">
        <h2 className="text-xl font-semibold text-text-dark mb-4">Restaurant Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-text-dark mb-2">Contact</h3>
            <div className="space-y-1 text-sm text-text-secondary">
              <p>Email: {restaurant.emailContact}</p>
              {restaurant.phoneContact && (
                <p>Phone: {restaurant.phoneContact}</p>
              )}
            </div>
          </div>

          {/* Reservation Settings */}
          <div>
            <h3 className="font-medium text-text-dark mb-2">Reservation Details</h3>
            <div className="space-y-1 text-sm text-text-secondary">
              <p>Party size: {restaurant.minGuestsPerReservation}-{restaurant.maxGuestsPerReservation} guests</p>
              <p>Time slots: Every {restaurant.slotInterval} minutes</p>
              <p>Advance booking: {leadTimeMin} - {leadTimeMax}</p>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="mt-6">
          <h3 className="font-medium text-text-dark mb-2">Opening Hours</h3>
          <div className="grid sm:grid-cols-2 gap-1 text-sm text-text-secondary">
            {openingHours.map((hours, index) => (
              <p key={index}>{hours}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Form Placeholder */}
      <div className="bg-surface-light rounded-lg p-8 border border-border-light">
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            {t('placeholder')}
          </p>
        </div>
      </div>
    </div>
  );
}
