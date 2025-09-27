# 036 – Audit Hardcoded Text and Implement Translation Keys

## Goal

Replace all hardcoded text throughout the application with proper translation keys to ensure complete internationalization coverage.

## Deliverable

- Audit all components, pages, and API responses for hardcoded French/English text
- Add missing translation keys to `messages/fr.json`
- Update components to use `useTranslations()` hook from next-intl, or getTranslations on server side.
- Replace hardcoded strings in forms, error messages, buttons, and user-facing text
- Ensure API error messages use translation keys where appropriate
- Update email templates to use translation keys consistently

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- All user-visible text uses translation keys from `messages/fr.json`
- No hardcoded French or English text remains in components
- Forms, buttons, and error messages display translated content
- Email templates render with proper French translations
- API responses use appropriate translation patterns

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
