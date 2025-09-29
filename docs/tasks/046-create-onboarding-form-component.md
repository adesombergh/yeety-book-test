# 046 – Create onboarding form component

## Goal

Build a minimal restaurant creation form that collects only the restaurant name and handles form submission.

## Deliverable

- `src/app/(dashboard)/onboarding/page.tsx` created with restaurant creation form
- Form uses React Hook Form with Zod validation
- Single required field: restaurant name (text input)
- Form submission calls server action
- Loading state during submission
- Error handling and display for validation failures

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Form renders with restaurant name input field
- Form validation prevents submission with empty name
- Form shows loading state during submission
- Error messages display for validation failures
- Form follows existing design system patterns

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
