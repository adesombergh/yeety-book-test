import { Button } from "@/components/ui/button";
import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('homepage');

  return (
    <div className="min-h-screen bg-background-warm flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-text-dark mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <Button size="lg" className="px-8 py-4 text-lg font-semibold">
              {t('getStarted')}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="px-6 py-3">
                🏢 Restaurant Dashboard
              </Button>
            </Link>
            <Link href="/test-restaurant/reservation">
              <Button variant="outline" size="lg" className="px-6 py-3">
                📅 Sample Reservation
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-accent-green p-6 rounded-brand text-white text-center">
            <h3 className="font-bold text-lg mb-2">{t('features.easySetup.title')}</h3>
            <p className="text-sm opacity-90">{t('features.easySetup.description')}</p>
          </div>
          <div className="bg-accent-pink p-6 rounded-brand text-text-dark text-center">
            <h3 className="font-bold text-lg mb-2">{t('features.smartBooking.title')}</h3>
            <p className="text-sm opacity-80">{t('features.smartBooking.description')}</p>
          </div>
          <div className="bg-accent-yellow p-6 rounded-brand text-text-dark text-center">
            <h3 className="font-bold text-lg mb-2">{t('features.analytics.title')}</h3>
            <p className="text-sm opacity-80">{t('features.analytics.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
