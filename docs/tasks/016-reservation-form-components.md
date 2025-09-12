# 016 – Reservation Form Components

## Goal

Create functional reservation form components with CloudFlare Turnstile widget integration using shadcn/ui and proper form validation.

## Deliverable

- Reservation form components in `src/components/ui/reservation-form.tsx`
- Date/time picker component using shadcn/ui calendar
- Guest count selector with min/max validation
- Customer information fields (firstName, lastName, email, phone, notes)
- CloudFlare Turnstile widget integration (client-side)
- React Hook Form setup with Zod validation schema
- Form loading states and error message display
- Responsive design following design tokens
- Form components exported and ready for page integration

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Reservation form renders correctly on test page
- CloudFlare Turnstile widget appears and functions properly
- Date picker shows available dates and times
- Guest count selector enforces min/max limits
- All form fields validate according to Zod schema
- Form shows appropriate loading states during interaction
- Error messages display clearly for validation failures
- Form is responsive and follows design system tokens

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
