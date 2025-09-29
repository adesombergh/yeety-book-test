# 049 – Test complete onboarding flow end-to-end

## Goal

Validate the entire onboarding experience from new user signup through first restaurant creation and dashboard access.

## Deliverable

- Complete onboarding flow tested with new user account
- Documentation of test scenarios and expected behaviors
- Verification that all components work together correctly
- Edge cases tested (duplicate names, validation errors)

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- New user signup redirects to `/onboarding` after authentication
- Onboarding form creates restaurant with correct defaults
- User is redirected to new restaurant's dashboard
- Subsequent logins bypass onboarding and go directly to dashboard
- Restaurant appears in user's restaurant list
- All default constraint values are properly set

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
