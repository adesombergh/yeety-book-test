# 045 – Install slugo package

## Goal

Install the `slugo` npm package for generating URL-safe restaurant slugs from names.

## Deliverable

- `slugo` package added to project dependencies via `pnpm add slugo`
- Package available for use in restaurant creation logic
- TypeScript types included (slugo has built-in types)

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- `slugo` appears in `package.json` dependencies
- Package can be imported: `import slugo from 'slugo'`
- Basic usage works: `slugo("Pizza Palace")` returns `"pizza-palace"`

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
