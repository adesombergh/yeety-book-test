# 004 – Database setup

## Goal

Add Prisma ORM and establish database connection to Supabase (starting with local development) to enable data persistence for the application.

## Deliverable

- Prisma installed and configured
- `schema.prisma` file created with basic setup
- Empty `Restaurant` model defined in schema
- Database connection string configured in `.env`
- Initial migration created and applied to local database

## Validation

- Run `pnpm prisma migrate dev` → executes without errors
- Database contains `restaurants` table with expected structure
- Prisma Client generates successfully
- Database connection is established and functional

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
