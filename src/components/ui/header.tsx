'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Header() {
  const t = useTranslations('auth')

  return (
    <header className="bg-background">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="font-bold text-xl text-text-dark">YeetyBook</span>
          </Link>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4">
            {/* Authenticated User */}
            <SignedIn>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
            </SignedIn>

            {/* Unauthenticated User */}
            <SignedOut>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">{t('signIn.title')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up">{t('signUp.title')}</Link>
                </Button>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
