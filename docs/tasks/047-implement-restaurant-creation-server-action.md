# 047 – Implement restaurant creation server action

## Goal

Create server action that handles first restaurant creation, user-restaurant linking, and redirection to settings page.

## Deliverable

- `src/lib/actions/restaurant.ts` created with `createRestaurant` server action
- Action creates restaurant with name, generated slug, and default constraint values (from task 042)
- User-restaurant relationship established via Prisma relation
- Proper error handling for duplicate slugs and database failures
- Redirect to `/dashboard/[restaurantId]/settings` on success
- Action is called from the restaurant creation form component

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Server action creates restaurant with correct default values
- User is linked as restaurant owner in database
- Unique slug generation handles duplicates properly (using slugo package from task 045)
- Action redirects to `/dashboard/[restaurantId]/settings` on success
- Error cases return appropriate error messages
- Action properly authenticates user with Clerk

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
