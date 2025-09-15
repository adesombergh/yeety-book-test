# 017 – Add isAdmin field to User model

## Goal

Add an `isAdmin` boolean field to the User model to enable admin users to access all restaurants in the system.

## Deliverable

- Updated Prisma schema with `isAdmin` boolean field in User model (default: false)
- Database migration created and applied successfully
- Prisma Client regenerated with new field type
- Updated User type definitions to include isAdmin field

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Run `pnpm prisma migrate dev` → migration applies successfully
- Database contains updated `users` table with `is_admin` boolean column
- Prisma Client generates without errors and includes isAdmin field

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
