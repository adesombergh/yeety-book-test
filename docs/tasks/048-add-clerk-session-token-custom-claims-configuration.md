# 048 – Add Clerk session token custom claims configuration

## Goal

Configure Clerk to include user public metadata in session tokens, enabling middleware access to onboarding status.

## Deliverable

- Clerk Dashboard session token configuration updated
- Custom claims JSON: `{"metadata": "{{user.public_metadata}}"}`
- Documentation comment in codebase explaining the configuration
- Session token includes `metadata.onboardingComplete` field

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Session tokens include `metadata` claim with user public metadata
- Middleware can access `sessionClaims.metadata.onboardingComplete`
- Onboarding redirect logic functions correctly with session claims
- New users have `onboardingComplete: undefined` in session metadata

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
