# 042 – Update Restaurant model for optional onboarding fields

## Goal

Modify the Restaurant database model to make most fields optional with sensible defaults, enabling minimal restaurant creation during onboarding.

## Deliverable

- Updated `prisma/schema.prisma` with optional fields for Restaurant model
- `emailContact` and `openingHours` fields made nullable
- Default values added for constraint fields (slotInterval: 60, minGuestsPerReservation: 1, maxGuestsPerReservation: 6, maxReservationsPerSlot: 1, reservationLeadTimeMin: 60, reservationLeadTimeMax: 129600)
- `subscriptionStatus` defaults to "active"
- Prisma migration generated and applied

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- `pnpm prisma migrate dev` applies migration successfully
- Restaurant can be created with only `name` and `slug` fields
- Default values are properly set for constraint fields
- Existing restaurants remain unaffected by schema changes

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
