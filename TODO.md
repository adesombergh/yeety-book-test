# TODO – Incremental development plan

This backlog follows the rules from `.clinerules`:

- Each step is small, clear, and testable.
- Each step must pass lint, typecheck, and build before moving to the next.
- Only one step at a time should be delivered and validated.

---

## Step 1 – Project setup

**Goal**: Initialize the project with Next.js, TypeScript, and base tooling.
**Deliverable**:

- A new Next.js app with `create-next-app`.
- TypeScript enabled.
- `pnpm` as package manager.
**Validation**:
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` → all succeed.
- Homepage renders “Hello World”.

---

## Step 2 – Styling base

**Goal**: Add TailwindCSS and configure base styles.
**Deliverable**:

- TailwindCSS installed and configured.
- A global style applied (e.g. change background color or add a styled heading).
**Validation**:
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed.
- Homepage renders with Tailwind styling visible.

---

## Step 3 – UI components library

**Goal**: Install and configure shadcn/ui.
**Deliverable**:

- shadcn/ui installed.
- At least one demo component (e.g. Button) displayed on homepage.
**Validation**:
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed.
- Homepage shows a styled Button from shadcn/ui.

---

## Step 4 – Database setup

**Goal**: Add Prisma and connect to Supabase (local dev first).
**Deliverable**:

- Prisma installed.
- `schema.prisma` with an empty `Restaurant` model.
- Migration applied to local DB.
**Validation**:
- `pnpm prisma migrate dev` runs without error.
- Database contains `restaurants` table.

---

## Step 5 – Internationalization setup

**Goal**: Prepare i18n (French only for now).
**Deliverable**:

- Install `next-intl` (or `next-i18next`).
- Create `fr.json` with a sample string.
- Replace “Hello World” with translation.
**Validation**:
- Homepage renders text from translation file.
- Switching locale to `fr` still works.

---

## Step 6 – Basic routing structure

**Goal**: Create base pages for public and private flows.
**Deliverable**:

- `/[restaurantSlug]/reservation` page (static text for now).
- `/dashboard` page (static text for now).
**Validation**:
- Navigating to `/test-restaurant/reservation` shows placeholder.
- Navigating to `/dashboard` shows placeholder.

---

## Step 7 – Clerk authentication (staff only)

**Goal**: Add Clerk and protect `/dashboard`.
**Deliverable**:

- Clerk installed and configured.
- `/dashboard` requires login.
**Validation**:
- Logged-out user → redirected.
- Logged-in user → sees dashboard placeholder.

---

## Step 8 – Restaurant model extension

**Goal**: Extend `Restaurant` with configuration fields.
**Deliverable**:

- Update Prisma schema with:
  - `slug`, `name`, `email_contact`, `phone_contact` (optional).
  - `opening_hours` (JSON).
  - Reservation constraints (slot_interval, min/max guests, etc.).
- Run migration.
**Validation**:
- Migration applies successfully.
- Database contains updated `restaurants` table.

---

## Step 9 – Reservation model

**Goal**: Add support for reservations.
**Deliverable**:

- `Reservation` model in Prisma with fields: id, restaurant_id, customer info, datetime, status.
- Run migration.
**Validation**:
- Migration applies successfully.
- Database contains `reservations` table.

---

## Step 10 – First API route (create reservation)

**Goal**: Enable customers to create reservations.
**Deliverable**:

- API route `POST /api/reservations` that inserts into DB.
**Validation**:
- `curl` or Postman call creates a reservation.
- Record visible in DB.

---

(continue with: cancellation API, Resend emails, dashboard UI, Stripe billing, etc.)
