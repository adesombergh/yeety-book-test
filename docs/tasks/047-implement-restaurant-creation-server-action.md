# 047 – Implement restaurant creation server action

## Goal

Create server action that handles restaurant creation, user-restaurant linking, and onboarding completion in Clerk metadata.

## Deliverable

- `src/app/(dashboard)/onboarding/_actions.ts` created with `createFirstRestaurant` server action
- Action creates restaurant with name, generated slug, and default constraint values
- User-restaurant relationship established via Prisma relation
- Clerk user metadata updated with `onboardingComplete: true`
- Proper error handling for duplicate slugs and database failures
- Redirect to new restaurant's dashboard on success

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Server action creates restaurant with correct default values
- User is linked as restaurant owner
- Clerk metadata is updated with onboarding completion
- Unique slug generation handles duplicates properly
- Action redirects to `/dashboard/[restaurantId]` on success
- Error cases return appropriate error messages

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
