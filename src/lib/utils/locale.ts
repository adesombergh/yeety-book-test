// Helper function to get locale from request headers
export function getLocaleFromHeaders(headers: Headers): string {
  const acceptLanguage = headers.get('accept-language')

  if (acceptLanguage) {
    // Parse Accept-Language header to get preferred locale
    const locales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())

    // Check if French is preferred
    if (locales.some((locale) => locale.startsWith('fr'))) {
      return 'fr'
    }
  }

  // Default to English
  return 'en'
}
