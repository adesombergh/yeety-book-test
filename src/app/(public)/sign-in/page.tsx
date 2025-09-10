import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SignInPage() {
  const t = useTranslations('auth')

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('signIn.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('signIn.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('signIn.formTitle')}</CardTitle>
            <CardDescription>
              {t('signIn.formDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('signIn.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signIn.emailPlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('signIn.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('signIn.passwordPlaceholder')}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              {t('signIn.submitButton')}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600">{t('signIn.noAccount')} </span>
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-500">
                {t('signIn.signUpLink')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {t('signIn.placeholder')}
          </p>
        </div>
      </div>
    </div>
  )
}
