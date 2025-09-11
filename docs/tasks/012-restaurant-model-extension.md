# 012 – Restaurant model extension

## Goal

Extend the Restaurant model in Prisma schema with comprehensive configuration fields to support restaurant-specific settings and reservation constraints.

## Deliverable

- Updated Prisma schema with extended Restaurant model including:
  - `slug` (unique identifier for URLs)
  - `name` (restaurant display name)
  - `email_contact` and `phone_contact` (optional contact information)
  - `opening_hours` (JSON field for flexible schedule storage)
  - Reservation constraints: `slot_interval`, `min_guests`, `max_guests`, etc.
- Database migration created and applied successfully
- Prisma Client regenerated with new schema

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Run `pnpm prisma migrate dev` → migration applies successfully
- Database contains updated `restaurants` table with all new fields
- Prisma Client generates without errors and includes new field types
- Schema validation passes for all new field constraints
- JSON fields are properly typed and accessible

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
