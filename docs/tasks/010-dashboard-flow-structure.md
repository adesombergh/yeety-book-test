# 010 – Dashboard flow structure

## Goal

Create the complete dashboard page structure with placeholder content to establish the restaurant management interface.

## Deliverable

- `/[locale]/dashboard` page with "Dashboard Home" placeholder
- `/[locale]/dashboard/[restaurantId]/calendar` page with "Calendar" placeholder
- `/[locale]/dashboard/[restaurantId]/day/[date]` page with "Day View" placeholder
- `/[locale]/dashboard/[restaurantId]/reservation/[id]` page with "Reservation Detail" placeholder
- `/[locale]/dashboard/[restaurantId]/settings` page with "Settings" placeholder
- `/[locale]/dashboard/[restaurantId]/billing` page with "Billing" placeholder

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Navigate to all dashboard pages → correct placeholders display
- Restaurant ID and other parameters are properly captured
- All pages render without errors and show translated content
- Dashboard navigation links work correctly between pages

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
