# 025 – Settings form validation and save

## Goal

Add form validation, data loading, and save functionality to the restaurant settings form, enabling complete restaurant configuration management.

## Deliverable

- React Hook Form integration with Zod validation schema
- Form data loading from existing restaurant configuration
- Save functionality with API endpoint `PATCH /api/restaurants/[restaurantSlug]`
- Form validation for all fields (required fields, format validation, constraints)
- Success/error feedback messages and loading states
- Proper handling of opening hours JSON structure

## Validation

- `pnpm lint` → succeeds without errors
- `pnpm typecheck` → passes TypeScript validation
- `pnpm build` → builds successfully
- Form loads existing restaurant data correctly
- Form validation prevents invalid submissions
- Save functionality updates restaurant data in database
- Success message displays after successful save
- Error messages display for validation failures and save errors
- Opening hours configuration saves and loads properly

## Accepted

- [x] Task requirements reviewed and approved

## Done

- [x] Task completed and validated
