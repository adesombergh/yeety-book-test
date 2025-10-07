import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/fr.json',
  },
})

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      new URL(
        'https://ckwbwnaqunbpssdfycvi.supabase.co/storage/v1/object/public/YeetyBookPublic/**'
      ),
    ],
  },
}

export default withNextIntl(nextConfig)
