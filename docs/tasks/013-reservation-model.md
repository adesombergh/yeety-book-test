# 013 – Reservation model

## Goal

Add comprehensive reservation support to the database schema to enable customers to book tables and restaurants to manage reservations.

## Deliverable

- `Reservation` model added to Prisma schema with essential fields:
  - `id` (unique identifier)
  - `restaurant_id` (foreign key to Restaurant)
  - Customer information: `firstName`, `lastName`, `email`, `phone`
  - Reservation details: `date`, `time`, `guests` (number of people)
  - `status` (pending, confirmed, cancelled, completed)
  - Timestamps: `createdAt`, `updatedAt`
- Database migration created and applied successfully
- Proper relationships established between Restaurant and Reservation models

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Run `pnpm prisma migrate dev` → migration applies successfully
- Database contains new `reservations` table with all required fields
- Foreign key relationship between restaurants and reservations works correctly
- Prisma Client generates with proper TypeScript types for reservations
- Schema relationships are properly defined and accessible

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
