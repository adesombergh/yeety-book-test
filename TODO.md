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

## ✅ Step 7 – Global layouts structure

**Goal**: Create the foundational layout structure for both public and dashboard areas to establish consistent navigation and visual hierarchy.

**Deliverable**:

- Global `app/layout.tsx` with header and footer components
- Public layout `app/(public)/layout.tsx` for customer-facing pages
- Dashboard layout `app/(dashboard)/layout.tsx` with navigation sidebar
- Basic header with logo, language switcher placeholder, and auth placeholders
- Dashboard sidebar with navigation links (Calendar, Reservations, Settings, Billing)

**Validation**:

- Navigate to `/en/test-restaurant/reservation` → public layout renders correctly
- Navigate to `/en/dashboard` → dashboard layout with sidebar renders correctly
- Header appears consistently across all pages
- All layouts use shadcn/ui components and design tokens

**Status**: ✅ **COMPLETED**

---

## ✅ Step 8 – Navigation and header/footer components

**Goal**: Implement comprehensive navigation system with header and footer components using shadcn/ui and design tokens.

**Deliverable**:

- Header component with logo, language switcher, and login/logout placeholders
- Dashboard sidebar navigation with links to main sections
- Footer component with copyright and placeholder links
- Responsive navigation that works on mobile and desktop
- All components built with shadcn/ui primitives

**Validation**:

- Header appears on all pages with consistent styling
- Dashboard sidebar shows navigation links (even if pages are empty)
- Footer displays correctly across all pages
- Navigation is responsive and accessible
- Components follow design philosophy and use design tokens

**Status**: ✅ **COMPLETED**

---

## ✅ Step 9 – Public reservation flow structure

**Goal**: Create the complete public-facing reservation flow with placeholder content to establish the customer journey structure.

**Deliverable**:

- `/[locale]/[restaurantSlug]/reservation` page with "Reservation Form" placeholder
- `/[locale]/[restaurantSlug]/reservation/success` page with "Reservation Success" placeholder
- `/[locale]/[restaurantSlug]/reservation/cancel/[token]` page with "Reservation Cancel" placeholder
- Proper routing and parameter handling for restaurant slug and cancellation token
- Internationalized placeholder content

**Validation**:

- Navigate to all three reservation flow pages → correct placeholders display
- Restaurant slug parameter is properly captured and accessible
- Cancellation token parameter works correctly
- All pages render without errors and show translated content

**Status**: ✅ **COMPLETED**

---

## ✅ Step 10 – Dashboard flow structure

**Goal**: Create the complete dashboard page structure with placeholder content to establish the restaurant management interface.

**Deliverable**:

- `/[locale]/dashboard` page with "Dashboard Home" placeholder
- `/[locale]/dashboard/[restaurantId]/calendar` page with "Calendar" placeholder
- `/[locale]/dashboard/[restaurantId]/day/[date]` page with "Day View" placeholder
- `/[locale]/dashboard/[restaurantId]/reservation/[id]` page with "Reservation Detail" placeholder
- `/[locale]/dashboard/[restaurantId]/settings` page with "Settings" placeholder
- `/[locale]/dashboard/[restaurantId]/billing` page with "Billing" placeholder

**Validation**:

- Navigate to all dashboard pages → correct placeholders display
- Restaurant ID and other parameters are properly captured
- All pages render without errors and show translated content
- Dashboard navigation links work correctly between pages

**Status**: ✅ **COMPLETED**

---

## ✅ Step 10.5 – Authentication route architecture

**Goal**: Define and organize the authentication route structure and protected route groups to establish a clear foundation for future authentication implementation.

**Deliverable**:

- Authentication route architecture documented in `docs/auth-architecture.md`
- Route protection groups clearly defined (public vs protected routes)
- Placeholder auth-related pages created with proper routing structure:
  - `/sign-in` page with placeholder content
  - `/sign-up` page with placeholder content
- Protected route structure validated (dashboard routes remain accessible for now)
- Internationalized placeholder content for auth pages
- Clear documentation of which routes will require authentication

**Validation**:

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Navigate to `/en/sign-in` → shows "Sign In" placeholder page
- Navigate to `/en/sign-up` → shows "Sign Up" placeholder page
- All existing routes continue to work without authentication requirements
- Documentation clearly defines public vs protected route groups
- Auth pages use shadcn/ui components and design tokens

**Status**: ✅ **COMPLETED**

---

## ✅ Step 11 – Clerk authentication (staff only)

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

**Status**: ✅ **COMPLETED**

---

## ✅ Step 12 – Restaurant model extension

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

**Status**: ✅ **COMPLETED**

---

## ✅ Step 13 – Reservation model

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

**Status**: ✅ **COMPLETED**

---

## ⏳ Step 14 – Basic Reservation API

**Goal**: Create the foundational reservation API endpoint with database integration to enable customers to submit reservation requests.

**Deliverable**:

- `POST /api/reservations` route created in `src/app/api/reservations/route.ts`
- Zod validation schema for reservation data (firstName, lastName, email, phone, date, guests, notes)
- Prisma database insertion logic with proper error handling
- JSON response format with success/error states
- Basic request validation and sanitization
- Proper HTTP status codes (200, 400, 500)

**Validation**:

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- API endpoint accepts valid reservation data via curl/Postman
- New reservation record appears in database with correct data
- API returns 400 error for invalid/missing required fields
- API returns 500 error for database connection issues
- Response format is consistent JSON with proper error messages

**Status**: ✅ **COMPLETED**

---

## ⏳ Step 15 – CloudFlare Turnstile Integration

**Goal**: Add CloudFlare Turnstile spam protection to the reservation API to prevent automated bot submissions while maintaining a frictionless user experience.

**Deliverable**:

- CloudFlare account setup documentation in task comments
- Turnstile site configuration with site key and secret key
- Environment variables added to `.env.local` and `.env.example`
- Server-side Turnstile token verification in reservation API
- `@cloudflare/turnstile` package installed and configured
- Error handling for failed Turnstile verification
- API middleware to validate Turnstile tokens before processing reservations

**Validation**:

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- CloudFlare Turnstile site created with valid keys
- Environment variables properly configured
- API rejects requests without Turnstile token (400 error)
- API rejects requests with invalid Turnstile token (400 error)
- API accepts requests with valid Turnstile token
- Proper error messages returned for Turnstile verification failures
- Test with curl using Turnstile test keys for development

**Status**: ✅ **COMPLETED**

---

## ⏳ Step 16 – Reservation Form Components

**Goal**: Create functional reservation form components with CloudFlare Turnstile widget integration using shadcn/ui and proper form validation.

**Deliverable**:

- Reservation form components in `src/components/ui/reservation-form.tsx`
- Date/time picker component using shadcn/ui calendar
- Guest count selector with min/max validation
- Customer information fields (firstName, lastName, email, phone, notes)
- CloudFlare Turnstile widget integration (client-side)
- React Hook Form setup with Zod validation schema
- Form loading states and error message display
- Responsive design following design tokens
- Form components exported and ready for page integration

**Validation**:

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Reservation form renders correctly on test page
- CloudFlare Turnstile widget appears and functions properly
- Date picker shows available dates and times
- Guest count selector enforces min/max limits
- All form fields validate according to Zod schema
- Form shows appropriate loading states during interaction
- Error messages display clearly for validation failures
- Form is responsive and follows design system tokens

**Status**: ⏳ **PENDING**

---

## ⏳ Step 17 – Complete Reservation Flow

**Goal**: Connect the reservation form to the protected API and complete the end-to-end booking flow with proper success/error handling.

**Deliverable**:

- Integration of reservation form with `POST /api/reservations` endpoint
- Form submission handling with Turnstile token inclusion
- Success state management with redirect to success page
- Error state handling with user-friendly error messages
- Loading states during API submission
- Success page updated with actual reservation details
- Form reset after successful submission
- Proper error recovery and retry mechanisms

**Validation**:

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Complete reservation flow works end-to-end from form to database
- Successful reservations redirect to `/[restaurantSlug]/reservation/success`
- Success page displays correct reservation details
- Failed submissions show appropriate error messages to user
- Form shows loading spinner during submission
- Turnstile verification works seamlessly in the flow
- New reservations appear in database with correct data and status
- Form handles network errors gracefully with retry options

**Status**: ⏳ **PENDING**

---

## Next Steps (Future Tasks)

After completing the above core reservation functionality, continue with:

- Email notifications with Resend (confirmation emails)
- Dashboard UI for managing reservations
- Reservation cancellation flow
- Stripe billing integration
- Advanced reservation management features
- Multi-restaurant support
- Analytics and reporting
