# 034 – Implement Translated Zod Error Messages

## Goal

Replace hardcoded English error messages in Zod schemas with internationalized error messages that use the existing next-intl translation system for proper French/English localization.

## Deliverable

- Add validation error messages to `messages/en.json` and `messages/fr.json`
- Create `src/lib/utils/zod-error-map.ts` utility for internationalized error handling
- Update `src/app/api/reservations/route.ts` Zod schema to use translated messages
- Update `src/app/api/reservations/cancel/route.ts` Zod schema to use translated messages
- Update `src/lib/schemas/restaurant-settings.ts` Zod schema to use translated messages
- Implement custom error map function that uses next-intl translations
- Ensure error messages display correctly in both English and French

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Validation error messages appear in French when locale is 'fr'
- Validation error messages appear in English when locale is 'en'
- All existing Zod schemas use translated error messages instead of hardcoded strings
- API endpoints return localized error messages based on request locale
- Form validation displays translated error messages in the UI
- Error message keys follow consistent naming convention in translation files

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
