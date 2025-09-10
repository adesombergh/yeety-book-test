# 007 – Global layouts structure

## Goal

Create the foundational layout structure for both public and dashboard areas to establish consistent navigation and visual hierarchy.

## Deliverable

- Global `app/layout.tsx` with header and footer components
- Public layout `app/(public)/layout.tsx` for customer-facing pages
- Dashboard layout `app/(dashboard)/layout.tsx` with navigation sidebar
- Basic header with logo, language switcher placeholder, and auth placeholders
- Dashboard sidebar with navigation links (Calendar, Reservations, Settings, Billing)

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Navigate to `/en/test-restaurant/reservation` → public layout renders correctly
- Navigate to `/en/dashboard` → dashboard layout with sidebar renders correctly
- Header appears consistently across all pages
- All layouts use shadcn/ui components and design tokens

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
