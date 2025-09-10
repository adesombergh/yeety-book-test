import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SignUpPage() {
  const t = useTranslations('auth')

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('signUp.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('signUp.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('signUp.formTitle')}</CardTitle>
            <CardDescription>
              {t('signUp.formDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('signUp.firstName')}</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t('signUp.firstNamePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('signUp.lastName')}</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t('signUp.lastNamePlaceholder')}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('signUp.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signUp.emailPlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('signUp.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('signUp.passwordPlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('signUp.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('signUp.confirmPasswordPlaceholder')}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              {t('signUp.submitButton')}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600">{t('signUp.hasAccount')} </span>
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-500">
                {t('signUp.signInLink')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {t('signUp.placeholder')}
          </p>
        </div>
      </div>
    </div>
  )
}
