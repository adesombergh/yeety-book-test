# 014 – Basic Reservation API

## Goal

Create the foundational reservation API endpoint with database integration to enable customers to submit reservation requests.

## Deliverable

- `POST /api/reservations` route created in `src/app/api/reservations/route.ts`
- Zod validation schema for reservation data (firstName, lastName, email, phone, date, guests, notes)
- Prisma database insertion logic with proper error handling
- JSON response format with success/error states
- Basic request validation and sanitization
- Proper HTTP status codes (200, 400, 500)

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- API endpoint accepts valid reservation data via curl/Postman:

  ```bash
  curl -X POST http://localhost:3000/api/reservations \
    -H "Content-Type: application/json" \
    -d '{"restaurantSlug":"test-restaurant","firstName":"John","lastName":"Doe","email":"john@example.com","date":"2024-01-15T19:00:00Z","guests":2}'
  ```

- New reservation record appears in database with correct data
- API returns 400 error for invalid/missing required fields
- API returns 500 error for database connection issues
- Response format is consistent JSON with proper error messages

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
