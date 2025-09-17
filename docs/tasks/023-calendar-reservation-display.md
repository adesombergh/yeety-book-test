# 023 – Calendar reservation display

## Goal

Add reservation data display functionality to the dashboard calendar, showing existing reservations in their appropriate time slots.

## Deliverable

- Reservation query function for calendar date range in `src/lib/queries/reservation-calendar.ts`
- Reservation display logic integrated into dashboard calendar component
- Reservation cards/blocks showing basic info (customer name, guests, time)
- Color coding for reservation status (pending, confirmed, cancelled)
- Click handler for reservation details (placeholder for future enhancement)
- Loading states for reservation data fetching

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Calendar displays existing reservations in correct time slots
- Reservation blocks show customer name, guest count, and time
- Different reservation statuses have distinct visual styling
- Calendar loads reservation data without errors
- Clicking on reservations shows placeholder interaction (console log or alert)

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
