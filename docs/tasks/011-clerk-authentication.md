# 011 – Clerk authentication (staff only)

## Goal

Add Clerk authentication system and protect the `/dashboard` route to ensure only authorized restaurant staff can access management features.

## Deliverable

- Clerk installed and properly configured with API keys
- Authentication middleware set up to protect dashboard routes
- `/dashboard` page requires user login to access
- Login/logout functionality working
- User session management implemented
- Redirect logic for unauthenticated users

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Logged-out user attempting to access `/dashboard` → redirected to login
- Logged-in user can successfully access `/dashboard` and see placeholder content
- Login and logout flows work without errors
- User authentication state persists across page refreshes
- Protected routes are properly secured

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
