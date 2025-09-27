# 035 – Remove English Locale and Set French as Default

## Goal

Configure the application to use only French locale, removing English support entirely to streamline the internationalization setup.

## Deliverable

- Update `src/i18n/routing.ts` to only include 'fr' locale
- Set French as default locale in routing configuration

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Application loads in French by default without locale prefix
- No English locale references remain in codebase
- Routing works correctly with French as the only supported locale
- All internationalized components render French text properly

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
