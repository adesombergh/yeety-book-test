# 045 – Create restaurant slug generation utility

## Goal

Implement utility functions for generating URL-safe restaurant slugs from names and ensuring uniqueness across the platform.

## Deliverable

- `src/lib/utils/slug.ts` created with slug generation functions
- `generateSlug(name: string)` function converts names to URL-safe slugs
- `ensureUniqueSlug(baseSlug: string)` function handles duplicate slugs with numeric suffixes
- Proper handling of special characters, spaces, and edge cases
- TypeScript types and JSDoc documentation

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- `generateSlug("Pizza Palace")` returns `"pizza-palace"`
- `generateSlug("Café & Bistro!")` returns `"cafe-bistro"`
- `ensureUniqueSlug` returns unique slug when duplicates exist
- Functions handle empty strings and special characters gracefully

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
