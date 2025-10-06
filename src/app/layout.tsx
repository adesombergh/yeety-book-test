import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ClerkProvider } from '@clerk/nextjs'
import { frFR } from '@clerk/localizations'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/next'
const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'YeetyBook - Restaurant Reservation System',
  description: 'Simplifying restaurant reservations for everyone',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get messages for internationalization
  const messages = await getMessages()

  return (
    <ClerkProvider localization={frFR}>
      <Analytics />
      <html lang="en">
        <body
          className={`${bricolageGrotesque.variable} antialiased min-h-screen flex flex-col`}
        >
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
