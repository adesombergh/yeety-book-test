# 021 – Restaurant switcher component

## Goal

Create a restaurant switcher component in the dashboard header that allows users to navigate between their restaurants and return to the restaurant list.

## Deliverable

- Restaurant switcher component in `src/components/ui/restaurant-switcher.tsx`
- Integration into dashboard layout header
- "My restaurants" link that redirects to `/dashboard`
- Current restaurant name display in header (only if logged in)
- Dropdown menu for users with multiple restaurants (future enhancement placeholder)
- Responsive design using shadcn/ui components

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Restaurant switcher appears in dashboard header on all restaurant pages
- "My restaurants" link redirects to `/dashboard` page correctly
- Current restaurant name displays correctly in header
- Component is responsive and follows design tokens
- Component integrates seamlessly with existing dashboard layout

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
