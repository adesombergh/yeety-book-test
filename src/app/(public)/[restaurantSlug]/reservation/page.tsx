import { getTranslations } from 'next-intl/server';

interface ReservationPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { restaurantSlug } = await params;
  const t = await getTranslations('reservation.form');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('title')}
        </h1>
        <p className="text-text-secondary">
          {t('subtitle', { restaurantName: restaurantSlug })}
        </p>
      </div>

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
