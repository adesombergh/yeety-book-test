import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

interface ReservationSuccessPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

export default async function ReservationSuccessPage({ params }: ReservationSuccessPageProps) {
  const { restaurantSlug } = await params;
  const t = await getTranslations('reservation.success');

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

      <Card>
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-text-secondary mb-4">
              {t('placeholder')}
            </p>
            <p className="text-text-secondary">
              {t('message')}
            </p>
          </div>
          <p className="text-sm text-text-muted">
            Restaurant: {restaurantSlug}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
