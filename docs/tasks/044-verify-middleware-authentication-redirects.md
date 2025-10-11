# 044 – Verify middleware authentication redirects

## Goal

Ensure the existing middleware properly redirects authenticated users to `/dashboard` after login/signup, enabling the dashboard page to handle restaurant existence checks.

## Deliverable

- Review `src/middleware.ts` to confirm authenticated users are redirected to `/dashboard`
- Verify public routes remain accessible without authentication
- Ensure no unnecessary redirect loops
- Update middleware if needed to support the onboarding flow

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- New authenticated users are redirected to `/dashboard` after signup/login
- Public routes (reservation pages, sign-in, sign-up) remain accessible
- No redirect loops occur
- Dashboard route is properly protected (requires authentication)

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
