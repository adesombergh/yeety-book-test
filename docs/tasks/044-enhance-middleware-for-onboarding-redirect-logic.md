# 044 – Enhance middleware for onboarding redirect logic

## Goal

Update the existing middleware to redirect authenticated users without completed onboarding to the `/onboarding` route.

## Deliverable

- `src/middleware.ts` updated with onboarding redirect logic
- Users with `userId` but without `sessionClaims.metadata.onboardingComplete` redirected to `/onboarding`
- Onboarding route itself excluded from redirect loop
- Existing route protection logic preserved

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- New authenticated users without onboarding are redirected to `/onboarding`
- Users with completed onboarding access dashboard normally
- Public routes remain accessible without authentication
- No redirect loops occur on `/onboarding` route

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
