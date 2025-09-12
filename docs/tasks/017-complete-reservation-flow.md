# 017 – Complete Reservation Flow

## Goal

Connect the reservation form to the protected API and complete the end-to-end booking flow with proper success/error handling.

## Deliverable

- Integration of reservation form with `POST /api/reservations` endpoint
- Form submission handling with Turnstile token inclusion
- Success state management with redirect to success page
- Error state handling with user-friendly error messages
- Loading states during API submission
- Success page updated with actual reservation details
- Form reset after successful submission
- Proper error recovery and retry mechanisms

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Complete reservation flow works end-to-end from form to database
- Successful reservations redirect to `/[restaurantSlug]/reservation/success`
- Success page displays correct reservation details
- Failed submissions show appropriate error messages to user
- Form shows loading spinner during submission
- Turnstile verification works seamlessly in the flow
- New reservations appear in database with correct data and status
- Form handles network errors gracefully with retry options

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
