# 048 – Test complete onboarding flow end-to-end

## Goal

Validate the entire onboarding experience from new user signup through first restaurant creation and dashboard access.

## Deliverable

- Complete onboarding flow tested with new user account
- Documentation of test scenarios and expected behaviors
- Verification that all components work together correctly
- Edge cases tested (duplicate names, validation errors)

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- **New user flow**:
  - User signs up/logs in via Clerk
  - Redirected to `/dashboard`
  - Sees "Create your restaurant" form (no existing restaurants)
  - Fills in restaurant name and submits
  - Redirected to `/dashboard/[restaurantId]/settings`
- **Returning user flow**:
  - User with existing restaurant(s) logs in
  - Redirected to `/dashboard`
  - Sees list of their restaurants (not the creation form)
- **Edge cases**:
  - Restaurant with duplicate name creates unique slug
  - Form validation prevents empty names
  - Error handling works for database failures
  - All default constraint values are properly set on new restaurant

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
