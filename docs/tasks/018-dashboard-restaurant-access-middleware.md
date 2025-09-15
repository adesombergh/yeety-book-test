# 018 – Dashboard restaurant access middleware

## Goal

Create middleware to verify that authenticated users have access to specific restaurants in dashboard routes, preventing unauthorized access to restaurant data.

## Deliverable

- Restaurant access verification function in `src/lib/auth/restaurant-access.ts`
- Middleware function that checks user-restaurant relationship
- 403 Forbidden response for unauthorized access attempts
- 404 Not Found response for non-existent restaurants
- Integration with Clerk user authentication
- TypeScript types for access verification results

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Authenticated user can access restaurants they own
- Authenticated user receives 403 when accessing restaurants they don't own
- Non-existent restaurant slugs return 404 error
- Admin users can access all restaurants (when isAdmin is true)

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
