# Project Brief - Multi-tenant Restaurant Reservation SaaS

## Project Overview

**Name**: yeety-book
**Type**: Multi-tenant Restaurant Reservation SaaS Platform
**Methodology**: Shape Up inspired, incremental development

## Core Mission

Enable restaurants to manage online reservations through a comprehensive SaaS platform where each restaurant has:

- **Public booking page** for customers (`/[restaurantSlug]/reservation`)
- **Private dashboard** for staff (`/dashboard/[restaurantId]/*`)

## Technology Stack

**Frontend & Backend**:

- Next.js 15+ (App Router) hosted on Vercel
- TypeScript mandatory everywhere
- TailwindCSS + shadcn/ui for UI components
- React Hook Form + Zod for forms and validation

**Database & ORM**:

- Supabase (PostgreSQL) for data persistence
- Prisma ORM for typesafe queries and migrations
- Multi-tenant schema with soft-delete patterns

**Authentication & Services**:

- Clerk for restaurant staff authentication
- Stripe Billing for subscription management
- Resend for transactional emails
- CloudFlare Turnstile for spam protection

## MVP Scope

### Customer Journey (B2C)

- Reservation booking without account creation
- Email confirmation with calendar invite (.ics)
- Secure cancellation via email token
- Mobile-optimized experience

### Restaurant Journey (B2B)

- Staff authentication and dashboard access
- 7-day calendar view with reservation management
- Restaurant configuration (hours, constraints, contact info)
- Subscription billing management
- Reservation status management (pending, confirmed, cancelled)

## Key Architectural Decisions

1. **Multi-tenant URL Structure**:
   - Public: `/[restaurantSlug]/*`
   - Private: `/dashboard/[restaurantId]/*`

2. **No Customer Accounts**: Customers book via email + secure tokens

3. **Subscription-Based**: Restaurants pay monthly via Stripe

4. **Internationalization**: French default, prepared for expansion

## Development Principles

- **Small, testable steps**: 10-30 minute tasks maximum
- **Validation required**: lint, typecheck, build must pass
- **One step at a time**: No parallel development
- **Shape Up methodology**: 6-week cycles with clear deliverables

## Success Metrics

- Restaurants can configure and manage reservations independently
- Customers can book without friction
- System scales to multiple restaurants per user
- Subscription billing works seamlessly
- All interactions are properly internationalized

This project brief serves as the foundation for all other Memory Bank files and guides all development decisions.
