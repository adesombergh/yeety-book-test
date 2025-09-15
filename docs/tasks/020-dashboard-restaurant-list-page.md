# 020 – Dashboard restaurant list page

## Goal

Create the main dashboard page that displays a list of restaurants owned by the authenticated user, with automatic redirection for single-restaurant users.

## Deliverable

- Updated `/dashboard` page in `src/app/(dashboard)/dashboard/page.tsx`
- Restaurant list component displaying user's restaurants
- "Go to dashboard" button for each restaurant linking to calendar
- Auto-redirect logic for users with only one restaurant
- Loading states and error handling for restaurant queries
- Responsive design using shadcn/ui components and design tokens

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- User with multiple restaurants sees list with "Go to dashboard" buttons
- User with single restaurant auto-redirects to `/dashboard/[restaurantSlug]/calendar`
- User with no restaurants sees appropriate empty state message
- Restaurant list displays restaurant names and basic info correctly
- Navigation links work and redirect to correct calendar pages

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
