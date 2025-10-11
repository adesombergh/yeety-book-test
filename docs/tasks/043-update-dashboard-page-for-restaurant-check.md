# 043 – Update dashboard page for restaurant check

## Goal

Modify the `/dashboard` page to check if the user has any restaurants and display a restaurant creation form if they don't.

## Deliverable

- `src/app/(dashboard)/dashboard/page.tsx` updated to query user's restaurants
- If user has no restaurants → display restaurant creation form/UI
- If user has restaurants → display existing restaurant list (current behavior)
- Query uses existing `getUserRestaurants` function from `src/lib/queries/user-restaurant.ts`
- Proper loading states and error handling

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- New user with no restaurants sees "Create your restaurant" screen
- User with existing restaurants sees restaurant list as before
- Page handles loading and error states appropriately
- UI follows existing design system patterns

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
