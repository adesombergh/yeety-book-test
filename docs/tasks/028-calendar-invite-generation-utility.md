# 028 – Calendar Invite Generation Utility

## Goal

Create a utility function to generate RFC 5545 compliant .ics calendar invite files for reservation confirmations that can be attached to emails.

## Deliverable

- Calendar invite utility in `src/lib/utils/calendar-invite.ts`
- `generateCalendarInvite()` function with proper TypeScript types
- RFC 5545 compliant .ics file format implementation
- Date formatting utility for ICS format (`YYYYMMDDTHHMMSSZ`)
- Support for reservation details (date, time, guests, restaurant info)
- 2-hour default duration for reservation events

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Function generates valid .ics content string
- Generated .ics file imports correctly into calendar applications
- All reservation details appear properly in calendar event
- Date/time formatting follows RFC 5545 specification

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
