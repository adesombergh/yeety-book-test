import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Forbidden() {
  const t = useTranslations('common')

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-dark mb-4">
          {t('accessForbidden')}
        </h1>
        <p className="text-text-secondary mb-6">
          {t('accessForbiddenMessage')}
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('returnToDashboard')}
        </Link>
      </div>
    </div>
  )
}
