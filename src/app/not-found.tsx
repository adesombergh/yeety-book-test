import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations()

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-dark mb-4">
          {t('errors.pageNotFound')}
        </h1>
        <p className="text-text-secondary mb-6">
          {t('errors.pageNotFoundMessage')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('errors.goHome')}
        </Link>
      </div>
    </div>
  )
}
