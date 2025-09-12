# 015 – CloudFlare Turnstile Integration

## Goal

Add CloudFlare Turnstile spam protection to the reservation API to prevent automated bot submissions while maintaining a frictionless user experience.

## Deliverable

- CloudFlare account setup documentation in task comments
- Turnstile site configuration with site key and secret key
- Environment variables added to `.env.local` and `.env.example`
- Server-side Turnstile token verification in reservation API
- `@cloudflare/turnstile` package installed and configured
- Error handling for failed Turnstile verification
- API middleware to validate Turnstile tokens before processing reservations

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- CloudFlare Turnstile site created with valid keys
- Environment variables properly configured
- API rejects requests without Turnstile token (400 error)
- API rejects requests with invalid Turnstile token (400 error)
- API accepts requests with valid Turnstile token
- Proper error messages returned for Turnstile verification failures
- Test with curl using Turnstile test keys for development

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
