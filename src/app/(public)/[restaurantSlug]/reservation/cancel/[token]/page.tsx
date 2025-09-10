import { getTranslations } from 'next-intl/server';

interface ReservationCancelPageProps {
  params: Promise<{
    restaurantSlug: string;
    token: string;
  }>;
}

export default async function ReservationCancelPage({ params }: ReservationCancelPageProps) {
  const { restaurantSlug, token } = await params;
  const t = await getTranslations('reservation.cancel');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('title')}
        </h1>
        <p className="text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      <div className="bg-surface-light rounded-lg p-8 border border-border-light">
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg text-text-secondary mb-4">
              {t('placeholder')}
            </p>
            <p className="text-text-secondary mb-6">
              {t('message')}
            </p>
          </div>
          <div className="space-y-2 text-sm text-text-muted">
            <p>Restaurant: {restaurantSlug}</p>
            <p>Cancellation Token: {token}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
