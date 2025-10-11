# 046 – Create restaurant creation form component

## Goal

Build a restaurant creation form component that can be displayed on the dashboard page when a user has no restaurants.

## Deliverable

- `src/components/restaurant/create-form.tsx` created with restaurant creation form
- Form uses React Hook Form with Zod validation
- Single required field: restaurant name (text input)
- Form submission calls server action
- Loading state during submission
- Error handling and display for validation failures
- Clean, welcoming UI for first-time users

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Form renders with restaurant name input field
- Form validation prevents submission with empty name
- Form shows loading state during submission
- Error messages display for validation failures
- Form follows existing design system patterns
- Component can be imported and used in dashboard page

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
