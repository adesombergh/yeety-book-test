# Technical Specification – Online Reservation SaaS

## Overview

The system is built on a modern serverless stack with maximum use of external services to accelerate delivery.
It is designed to be multi-tenant, scalable, and fast to ship (Shape Up methodology).

---

## Architecture

### Frontend & Backend

- **Framework**: Next.js (App Router) hosted on **Vercel**.
- **Styling/UI**: TailwindCSS + shadcn/ui.
- **Forms & Validation**: React Hook Form + Zod.
- **Calendar**: FullCalendar or react-big-calendar.

### Database

- **Supabase (Postgres)** – relational database with multi-tenant schema:
  - `restaurants` (slug, name, settings, subscription status).
  - `restaurant_user` (links Clerk user → restaurant).
  - `reservations` (customer info, date/time, status).
  - `reservation_tokens` (unique tokens for cancellation).
- **ORM**: Prisma (typesafe queries, migrations).
- **Security**: Row Level Security (RLS) if needed.

### Authentication

- **Clerk** for restaurant staff login.
- Customers do not need accounts – handled via email + token system.

### Emails & Notifications

- **Resend** for transactional emails:
  - Reservation confirmation.
  - Calendar invite (.ics).
  - Cancellation emails.
  - (Later) Reminder emails.
- Tokens embedded in cancellation links for secure flows.

### Jobs / Scheduling

- **Supabase scheduled functions** for reminders.
- Optionally **Upstash QStash** for advanced scheduling.

### Billing

- **Stripe Billing** for subscription management.
- **Stripe Tax** enabled for EU VAT compliance.
- Stripe Checkout for subscription sign-up.
- Webhooks update Supabase (`subscription_status`) on payment events.

### Monitoring / Observability

- **Sentry** for error tracking (frontend + backend).
- Optional: Logtail or Datadog for central log aggregation.

---

## Deployment Workflow

1. **Local development**:
   - Next.js app + Prisma migrations.
   - Supabase CLI for local Postgres testing.
2. **Staging**:
   - Deploy branch to Vercel preview.
   - Supabase project with staging database.
3. **Production**:
   - Vercel production deployment.
   - Supabase production database.
   - Webhooks (Stripe, Clerk, Resend) connected.

---

## Long-term Evolutions

- Add analytics module (reservations trends).
- Support multiple establishments per tenant.
- Optional integration with POS or external CRM.
- Replace Clerk with Supabase Auth if reducing external dependencies becomes necessary.
