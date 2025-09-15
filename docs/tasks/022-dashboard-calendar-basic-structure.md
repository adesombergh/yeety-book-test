# 022 – Dashboard calendar basic structure

## Goal

Create the basic calendar component structure for the dashboard using a weekly view layout, preparing the foundation for displaying reservation data.

## Deliverable

- Calendar component in `src/components/ui/dashboard-calendar.tsx`
- Weekly view layout with 7-day grid
- Time slot structure (configurable intervals)
- Integration with restaurant opening hours
- Basic calendar navigation (previous/next week)
- Updated calendar page in `src/app/(dashboard)/dashboard/[restaurantSlug]/calendar/page.tsx`

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Calendar displays current week with 7 days
- Time slots are visible and properly structured
- Week navigation buttons work (previous/next week)
- Calendar respects restaurant opening hours configuration
- Calendar page loads without errors and displays calendar component

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
