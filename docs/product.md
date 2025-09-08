# Product Specification – Online Reservation SaaS

## Overview

A multi-tenant SaaS platform that enables restaurants to manage online reservations.
Each restaurant has its own public booking page for customers and a private dashboard for staff.
The platform is subscription-based (restaurants pay a monthly fee via credit card).

---

## MVP Scope

### Public (Customer side)

- Reservation form available at `/[restaurantSlug]/reservation`.
- Select number of guests, date, and time (configurable in 15-minute slots).
- Provide customer information: first name, last name, email (mandatory), phone, comments.
- Confirmation email with:
  - Reservation details.
  - Calendar invite (.ics).
  - Cancellation link.
- Cancellation workflow:
  - Customer clicks cancellation link.
  - Redirect to confirmation page.
  - Both restaurant and customer receive cancellation email.

### Private (Restaurant staff side)

- Authentication via Clerk (only staff accounts).
- Dashboard available at `/dashboard/[restaurantId]`.
- Calendar view (7 days).
- Daily reservation list.
- Reservation details view (with customer info).
- Actions:
  - Cancel reservation (customer notified via email).
- Restaurant configuration:
  - Basic info (name, slug, contact email, optional phone).
  - Opening hours (JSON, daily slots).
  - Reservation constraints:
    - Slot interval (e.g. 15 min).
    - Min/max guests per reservation.
    - Max reservations per slot.
    - Lead time minimum (minutes before booking).
    - Lead time maximum (days in advance).

---

## Nice-to-have (future iterations)

- Reminder email the day before reservation.
- Newsletter opt-in for customers.
- Advanced dashboard features (drag & drop, filters).
- Integration with POS or CRM.
- Analytics (no-shows, peak hours).
- More detailed restaurant configuration (menus, images, seating maps).

---

## Subscription / Billing

- Restaurants subscribe via Stripe Billing.
- Pricing plan(s) defined in Stripe.
- Billing page inside dashboard with subscription status.
- Only subscribed restaurants can access dashboard.
- VAT support in Europe via Stripe Tax (automatic collection and invoice generation).

---

## Internationalization (i18n)

- All UI strings handled through i18n from the start.
- Default language: **French**.
- Framework prepared for additional languages later.
