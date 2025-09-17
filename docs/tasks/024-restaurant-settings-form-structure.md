# 024 – Restaurant settings form structure

## Goal

Create the restaurant settings form structure with all configuration fields, preparing the foundation for restaurant management functionality.

## Deliverable

- Settings form component in `src/components/ui/restaurant-settings-form.tsx`
- Form fields for basic info (name, slug, contact email, phone)
- Opening hours configuration section (7-day weekly structure)
- Reservation constraints fields (min/max guests, lead times, slot intervals)
- Form layout using shadcn/ui components and design tokens
- Updated settings page in `src/app/(dashboard)/dashboard/[restaurantSlug]/settings/page.tsx`

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Settings form displays all required fields correctly
- Opening hours section shows 7-day weekly structure
- Reservation constraint fields are properly labeled and organized
- Form uses shadcn/ui components and follows design system
- Settings page loads and displays form without errors

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
