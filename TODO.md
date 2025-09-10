# TODO – Incremental development plan

This backlog follows the rules from `.clinerules`:

- Each step is small, clear, and testable.
- Each step must pass lint, typecheck, and build before moving to the next.
- Only one step at a time should be delivered and validated.

**Progress Status**: ✅ = Completed | 🔄 = In Progress | ⏳ = Pending

---

## ✅ Step 1 – Project setup

**Goal**: Initialize the project with Next.js, TypeScript, and base tooling to establish a solid foundation for the multi-tenant restaurant reservation SaaS platform.

**Deliverable**:

- A new Next.js app created with `create-next-app`
- TypeScript enabled and configured
- `pnpm` configured as the package manager
- Basic project structure with App Router
- ESLint and build configuration working

**Validation**:

- Run `pnpm lint` → succeeds without errors
- Run `pnpm typecheck` → passes TypeScript validation
- Run `pnpm build` → builds successfully
- Homepage renders "Hello World" when visiting `http://localhost:3000`
- All Next.js development tools are functional

**Status**: ✅ **COMPLETED**

---

## ✅ Step 2 – Styling base

**Goal**: Add TailwindCSS and configure base styles to enable modern, responsive styling throughout the application.

**Note**: Refer to `docs/design-philosophy.md` for the complete visual direction, including brand colors, typography, and design principles.

**Deliverable**:

- TailwindCSS installed and properly configured
- PostCSS configuration set up
- Tailwind directives added to global CSS
- A global style applied (e.g. change background color or add a styled heading)
- Basic Tailwind utilities working across the application

**Validation**:

- Run `pnpm lint`, `pnpm typecheck`, `pnpm build` → all succeed
- Homepage renders with visible Tailwind styling (colors, spacing, typography)
- Tailwind classes are properly applied and functional

**Status**: ✅ **COMPLETED**

---

## ✅ Step 3 – UI components library

**Goal**: Install and configure shadcn/ui to provide a comprehensive set of accessible, customizable UI components.

**Note**: Refer to `docs/design-philosophy.md` for the complete visual direction, including brand colors, typography, and design principles.

**Deliverable**:

- shadcn/ui installed and properly configured
- `components.json` configuration file created
- At least one demo component (e.g. Button) displayed on homepage
- Component library structure established in `src/components/ui/`
- Utility functions for component styling set up

**Validation**:

- Run `pnpm lint`, `pnpm typecheck`, `pnpm build` → all succeed
- Homepage shows a styled Button component from shadcn/ui
- Components are properly themed and responsive

**Status**: ✅ **COMPLETED**

---

## ✅ Step 4 – Database setup

**Goal**: Add Prisma ORM and establish database connection to Supabase (starting with local development) to enable data persistence.

**Deliverable**:

- Prisma installed and configured
- `schema.prisma` file created with basic setup
- Empty `Restaurant` model defined in schema
- Database connection string configured in `.env`
- Initial migration created and applied to local database

**Validation**:

- Run `pnpm prisma migrate dev` → executes without errors
- Database contains `restaurants` table with expected structure
- Prisma Client generates successfully
- Database connection is established and functional

**Status**: ✅ **COMPLETED**

---

## ✅ Step 5 – Internationalization setup

**Goal**: Prepare internationalization (i18n) infrastructure with French language support to enable multi-language functionality.

**Deliverable**:

- Install `next-intl` (or `next-i18next`) for i18n support
- Create `fr.json` and `en.json` translation files with sample strings
- Configure Next.js for internationalization
- Replace "Hello World" homepage text with translated content
- Set up locale detection and switching mechanism

**Validation**:

- Homepage renders text from translation file instead of hardcoded strings
- Switching locale to `fr` displays French translations
- Translation system works without errors
- Build process includes i18n configuration successfully

**Status**: ✅ **COMPLETED**

---

## ✅ Step 6 – Basic routing structure

**Goal**: Create the foundational page structure for both public customer-facing pages and private restaurant management flows using Next.js App Router.

**Deliverable**:

- `/[locale]/[restaurantSlug]/reservation` page created with static placeholder content
- `/[locale]/dashboard` page created with static placeholder content
- Proper file structure following Next.js App Router conventions
- Basic navigation between pages working
- Multi-tenant URL structure established with restaurant slug parameter

**Validation**:

- Navigating to `/en/test-restaurant/reservation` shows reservation placeholder page
- Navigating to `/en/dashboard` shows dashboard placeholder page
- Both pages render without errors
- Restaurant slug parameter is properly captured and accessible
- Routing works correctly in both development and build modes

**Status**: ✅ **COMPLETED**

---

## ⏳ Step 7 – Clerk authentication (staff only)

**Goal**: Add Clerk authentication system and protect the `/dashboard` route to ensure only authorized restaurant staff can access management features.

**Deliverable**:

- Clerk installed and properly configured with API keys
- Authentication middleware set up to protect dashboard routes
- `/dashboard` page requires user login to access
- Login/logout functionality working
- User session management implemented
- Redirect logic for unauthenticated users

**Validation**:

- Logged-out user attempting to access `/dashboard` → redirected to login
- Logged-in user can successfully access `/dashboard` and see placeholder content
- Login and logout flows work without errors
- User authentication state persists across page refreshes
- Protected routes are properly secured

**Status**: ⏳ **PENDING**

---

## ⏳ Step 8 – Restaurant model extension

**Goal**: Extend the Restaurant model in Prisma schema with comprehensive configuration fields to support restaurant-specific settings and reservation constraints.

**Deliverable**:

- Updated Prisma schema with extended Restaurant model including:
  - `slug` (unique identifier for URLs)
  - `name` (restaurant display name)
  - `email_contact` and `phone_contact` (optional contact information)
  - `opening_hours` (JSON field for flexible schedule storage)
  - Reservation constraints: `slot_interval`, `min_guests`, `max_guests`, etc.
- Database migration created and applied successfully
- Prisma Client regenerated with new schema

**Validation**:

- Run `pnpm prisma migrate dev` → migration applies successfully
- Database contains updated `restaurants` table with all new fields
- Prisma Client generates without errors and includes new field types
- Schema validation passes for all new field constraints
- JSON fields are properly typed and accessible

**Status**: ⏳ **PENDING**

---

## ⏳ Step 9 – Reservation model

**Goal**: Add comprehensive reservation support to the database schema to enable customers to book tables and restaurants to manage reservations.

**Deliverable**:

- `Reservation` model added to Prisma schema with essential fields:
  - `id` (unique identifier)
  - `restaurant_id` (foreign key to Restaurant)
  - Customer information: `firstName`, `lastName`, `email`, `phone`
  - Reservation details: `date`, `time`, `guests` (number of people)
  - `status` (pending, confirmed, cancelled, completed)
  - Timestamps: `createdAt`, `updatedAt`
- Database migration created and applied successfully
- Proper relationships established between Restaurant and Reservation models

**Validation**:

- Run `pnpm prisma migrate dev` → migration applies successfully
- Database contains new `reservations` table with all required fields
- Foreign key relationship between restaurants and reservations works correctly
- Prisma Client generates with proper TypeScript types for reservations
- Schema relationships are properly defined and accessible

**Status**: ⏳ **PENDING**

---

## ⏳ Step 10 – First API route (create reservation)

**Goal**: Enable customers to create reservations by implementing the first API endpoint that accepts reservation data and persists it to the database.

**Deliverable**:

- API route `POST /api/reservations` created and functional
- Request validation using Zod or similar validation library
- Database insertion logic using Prisma Client
- Proper error handling and HTTP status codes
- JSON response format established
- Basic reservation creation workflow complete

**Validation**:

- `curl` or Postman POST request to `/api/reservations` successfully creates a reservation
- New reservation record is visible in the database
- API returns appropriate success/error responses
- Request validation works for required fields
- Database constraints are properly enforced
- API endpoint handles edge cases gracefully

**Status**: ⏳ **PENDING**

---

## Next Steps (Future Tasks)

After completing the above 10 foundational steps, continue with:

- Reservation cancellation API
- Email notifications with Resend
- Dashboard UI for managing reservations
- Customer-facing reservation form
- Stripe billing integration
- Advanced reservation management features
- Multi-restaurant support
- Analytics and reporting
