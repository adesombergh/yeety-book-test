# 043 – Create onboarding route structure and layout

## Goal

Establish the `/onboarding` route with proper layout that prevents access for users who have already completed onboarding.

## Deliverable

- `src/app/(dashboard)/onboarding/layout.tsx` created with onboarding completion check
- Layout redirects to `/` if `sessionClaims.metadata.onboardingComplete` is true
- Route structure follows existing dashboard patterns
- Proper TypeScript types for layout props

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Users with completed onboarding cannot access `/onboarding` (redirected to `/`)
- Users without completed onboarding can access the route
- Layout renders children properly for eligible users

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
