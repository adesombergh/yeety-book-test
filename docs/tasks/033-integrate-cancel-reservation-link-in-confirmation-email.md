# 033 – Integrate Cancel Reservation Link in Confirmation Email

## Goal

Add a secure cancellation link to the reservation confirmation email template that allows customers to cancel their reservation directly from the email using the existing cancel token system.

## Deliverable

- Update `src/components/emails/reservation-confirmation.tsx` to include cancellation link
- Add cancellation link text to both English and French translation files
- Cancellation link uses existing `cancelToken` from reservation data
- Link points to `/[restaurantSlug]/reservation/cancel/[token]` route
- Styled cancellation button/link consistent with email template design
- Multi-language support for cancellation link text

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Reservation confirmation email template includes visible cancellation link
- Cancellation link uses correct URL format with restaurant slug and cancel token
- Link text displays in both English and French based on locale prop
- Email template maintains consistent styling and branding
- Cancellation link is clearly visible but not overly prominent in email layout

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
