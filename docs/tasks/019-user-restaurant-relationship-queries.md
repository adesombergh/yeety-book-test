# 019 – User-restaurant relationship queries

## Goal

Create database query functions to retrieve user-restaurant relationships, enabling the dashboard to display restaurants owned by authenticated users.

## Deliverable

- Query function `getUserRestaurants(userId)` in `src/lib/queries/user-restaurant.ts`
- Query function `getUserRestaurantBySlug(userId, restaurantSlug)` for single restaurant access
- Admin query function `getAllRestaurantsForAdmin()` for admin users
- Proper TypeScript types for query results
- Error handling for database connection issues
- Integration with existing restaurant query patterns

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- `getUserRestaurants()` returns array of restaurants for valid user
- `getUserRestaurantBySlug()` returns single restaurant or null
- `getAllRestaurantsForAdmin()` returns all restaurants in system
- Query functions handle database errors gracefully
- TypeScript types are properly exported and usable

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
