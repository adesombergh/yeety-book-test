# 014 – First API route (create reservation)

## Goal

Enable customers to create reservations by implementing the first API endpoint that accepts reservation data and persists it to the database.

## Deliverable

- API route `POST /api/reservations` created and functional
- Request validation using Zod or similar validation library
- Database insertion logic using Prisma Client
- Proper error handling and HTTP status codes
- JSON response format established
- Basic reservation creation workflow complete

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- `curl` or Postman POST request to `/api/reservations` successfully creates a reservation
- New reservation record is visible in the database
- API returns appropriate success/error responses
- Request validation works for required fields
- Database constraints are properly enforced
- API endpoint handles edge cases gracefully

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
