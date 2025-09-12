# User Flows – Multi-tenant Restaurant Reservation SaaS

This document provides a comprehensive overview of all user flows in the yeety-book platform, covering both restaurant owners (B2B) and customers (B2C) journeys, technical architecture, and integration workflows.

## Overview

The platform serves two distinct user types:

- **Restaurant Owners** (B2B): Manage reservations, configure settings, handle billing
- **Customers** (B2C): Make reservations without accounts, manage bookings via email

## 1. Restaurant Owner Journey (B2B)

### 1.1 Initial Onboarding Flow

#### **Discovery & Landing** → `/`

```
User discovers platform → Views features/pricing → Clicks "Get Started"
```

- Landing page showcases platform benefits
- Pricing information and feature comparison
- Testimonials and social proof
- Clear call-to-action buttons

#### **Account Creation** → `/sign-up`

```
Sign-up form → Clerk authentication → Email verification → User record creation
```

- Clerk handles secure authentication
- Webhook creates User record in database
- Email verification process
- Welcome email sent via Resend

#### **Restaurant Setup** → `/dashboard` (First-time flow)

```
Restaurant profile → Operating hours → Reservation rules → Stripe subscription
```

**Step 1: Restaurant Profile**

- Restaurant name and unique slug
- Contact information (email required, phone optional)
- Basic restaurant details

**Step 2: Operating Hours Configuration**

- JSON-based daily schedule
- Flexible time slot definitions
- Holiday/closure management

**Step 3: Reservation Rules**

- Slot intervals (15, 30, 60 minutes)
- Guest limits (min/max per reservation)
- Maximum reservations per time slot
- Lead time constraints (min/max booking window)

**Step 4: Subscription Setup**

- Stripe Checkout integration
- Monthly billing configuration
- VAT handling for EU customers
- Payment method setup

#### **Dashboard Access** → `/dashboard/[restaurantId]`

```
Subscription verified → Dashboard unlocked → Calendar view loaded
```

- Real-time reservation calendar
- Quick stats and metrics
- Navigation to all management features

### 1.2 Daily Operations Flow

#### **Reservation Management**

**Calendar View** → `/dashboard/[restaurantId]/calendar`

```
7-day calendar → Reservation overview → Click for details
```

- Weekly calendar with reservation blocks
- Color-coded status indicators
- Drag-and-drop functionality (future)
- Quick actions (confirm, cancel)

**Daily View** → `/dashboard/[restaurantId]/day/[date]`

```
Selected date → Time slot breakdown → Reservation list
```

- Detailed daily schedule
- Time slot availability
- Customer information display
- Reservation status management

**Individual Reservations** → `/dashboard/[restaurantId]/reservation/[id]`

```
Reservation details → Customer info → Actions (cancel, modify, notes)
```

- Complete customer information
- Reservation history and notes
- Status change capabilities
- Communication tools

#### **Configuration Management**

**Settings** → `/dashboard/[restaurantId]/settings`

```
Restaurant profile → Operating hours → Reservation rules → Save changes
```

- Update restaurant information
- Modify operating schedules
- Adjust reservation constraints
- Integration settings

**Billing** → `/dashboard/[restaurantId]/billing`

```
Subscription status → Payment history → Update payment method
```

- Current subscription details
- Invoice history and downloads
- Payment method management
- Upgrade/downgrade options

### 1.3 Account Lifecycle (Netflix Pattern)

#### **Account Deletion**

```
User deletes account → Clerk removes auth → Webhook soft-deletes User
```

- `deletedAt` timestamp set
- `clerkId` cleared (set to null)
- Email preserved as stable identifier
- **All restaurants and reservations preserved**

#### **Account Restoration**

```
User re-signs up → New clerkId assigned → Existing User restored
```

- Same email address recognized
- New `clerkId` from Clerk
- `deletedAt` cleared
- **Full access to previous restaurants restored**

## 2. Customer Journey (B2C)

### 2.1 Reservation Flow

#### **Discovery** → `/[restaurantSlug]/reservation`

```
Customer finds booking page → Views available slots → No account required
```

- Restaurant-specific booking interface
- Real-time availability display
- Operating hours consideration
- Mobile-optimized experience

#### **Booking Process**

```
Date selection → Time selection → Guest count → Customer info → Confirmation
```

**Step 1: Date/Time Selection**

- Calendar widget with available dates
- Time slots based on restaurant configuration
- Real-time availability checking
- Slot interval enforcement

**Step 2: Guest Count**

- Dropdown within min/max limits
- Dynamic pricing display (future)
- Party size validation

**Step 3: Customer Information**

- First name, last name (required)
- Email address (required)
- Phone number (optional)
- Special requests/notes (optional)

**Step 4: Form Validation**

- Zod schema validation
- Real-time field validation
- Error message display
- Accessibility compliance

#### **Reservation Creation** → `POST /api/reservations`

```
Form submission → Server validation → Database insertion → Email trigger
```

- Server-side validation with Zod
- Availability double-check
- Unique `cancelToken` generation
- Status set to PENDING
- Prisma database transaction

#### **Confirmation** → `/[restaurantSlug]/reservation/success`

```
Success page → Reservation details → Email confirmation sent
```

- Confirmation page with booking details
- Next steps information
- Contact information display

**Email Workflow** (via Resend):

1. **Confirmation Email**:
   - Reservation details summary
   - Restaurant contact information
   - Cancellation link with secure token

2. **Calendar Invite**:
   - .ics file attachment
   - Automatic calendar integration
   - Reminder settings

### 2.2 Post-Booking Actions

#### **Cancellation Flow** → `/[restaurantSlug]/reservation/cancel/[token]`

```
Email link clicked → Token validation → Confirmation page → Database update
```

- Secure token verification
- Reservation status update to CANCELLED
- `cancelledAt` timestamp set
- Dual email notifications

**Email Notifications**:

1. **Customer**: Cancellation confirmation
2. **Restaurant**: Cancellation alert with details

#### **Future Enhancements**

- **Reminder Emails**: Day-before notifications
- **Newsletter Opt-in**: Marketing communications
- **Feedback Collection**: Post-visit surveys
- **Modification Requests**: Change date/time/guests

## 3. Technical Flow Architecture

### 3.1 Authentication & Authorization

#### **Route Protection**

```
Request → Middleware → Auth check → Route access/redirect
```

**Public Routes** (No authentication):

- `/` - Landing page
- `/[restaurantSlug]/*` - Reservation flow
- `/sign-in`, `/sign-up` - Authentication pages

**Protected Routes** (Clerk authentication required):

- `/dashboard/*` - All management features
- `/api/dashboard/*` - Management APIs

#### **Multi-tenant Security**

```
User authentication → Restaurant ownership check → Data access control
```

- User-Restaurant relationship validation
- Row-level security enforcement
- Subscription status verification

### 3.2 Data Flow Patterns

#### **Customer Reservation Flow**

```
Form → Validation → API → Database → Email → Confirmation
```

1. Client-side form validation (React Hook Form + Zod)
2. Server-side validation and sanitization
3. Database transaction (Prisma)
4. Email queue (Resend)
5. Success response and redirect

#### **Restaurant Management Flow**

```
Dashboard → API → Database → Real-time Updates → UI Refresh
```

1. Dashboard action (view, create, update, delete)
2. API endpoint with authentication
3. Database operation with validation
4. Real-time updates (Supabase subscriptions)
5. UI state synchronization

#### **Billing Integration Flow**

```
Stripe Checkout → Webhooks → Database → Access Control → Dashboard
```

1. Stripe Checkout session creation
2. Payment processing
3. Webhook event handling
4. Subscription status update
5. Dashboard access control

### 3.3 Email Workflows

#### **Transactional Emails** (Resend)

**Reservation Confirmation**:

```
Reservation created → Email template → Resend API → Customer inbox
```

- Immediate delivery
- Reservation details
- Calendar invite attachment
- Cancellation link

**Cancellation Notifications**:

```
Cancellation triggered → Dual emails → Customer + Restaurant
```

- Customer: Confirmation of cancellation
- Restaurant: Alert with customer details

**Future Email Workflows**:

- **Reminder Emails**: Scheduled 24h before reservation
- **Billing Notifications**: Payment confirmations, failures
- **Marketing Emails**: Newsletter, promotions (opt-in)

## 4. Multi-tenant Architecture

### 4.1 URL Structure

#### **Public URLs** (Customer-facing)

```
/{locale}/[restaurantSlug]/reservation
/{locale}/[restaurantSlug]/reservation/success
/{locale}/[restaurantSlug]/reservation/cancel/[token]
```

#### **Private URLs** (Restaurant management)

```
/{locale}/dashboard
/{locale}/dashboard/[restaurantId]/calendar
/{locale}/dashboard/[restaurantId]/day/[date]
/{locale}/dashboard/[restaurantId]/reservation/[id]
/{locale}/dashboard/[restaurantId]/settings
/{locale}/dashboard/[restaurantId]/billing
```

#### **Authentication URLs**

```
/{locale}/sign-in
/{locale}/sign-up
```

### 4.2 Data Isolation

#### **Database Design**

```
User → Restaurant (Many-to-Many) → Reservations (One-to-Many)
```

- User can own multiple restaurants
- Restaurant belongs to multiple users (team access)
- Reservations belong to single restaurant
- Soft delete pattern preserves data

#### **Access Control**

```
Request → User ID → Restaurant ownership → Data filtering
```

- Middleware validates user authentication
- Database queries filtered by restaurant ownership
- Row-level security for sensitive operations

## 5. Integration Points

### 5.1 External Services

#### **Clerk** (Authentication)

```
User actions → Clerk API → Webhooks → Database sync
```

- User registration/deletion
- Session management
- Profile updates
- Security features

#### **Stripe** (Billing)

```
Subscription events → Webhooks → Database updates → Access control
```

- Payment processing
- Subscription management
- Invoice generation
- VAT compliance (EU)

#### **Resend** (Email)

```
Email triggers → Resend API → Delivery → Status webhooks
```

- Transactional emails
- Template management
- Delivery tracking
- Bounce handling

#### **Supabase** (Database)

```
Application → Prisma → Supabase → Real-time updates
```

- PostgreSQL database
- Real-time subscriptions
- Row-level security
- Backup and scaling

#### **Vercel** (Hosting)

```
Git push → Build → Deploy → CDN distribution
```

- Serverless functions
- Edge caching
- Preview deployments
- Analytics

### 5.2 Webhook Flows

#### **Clerk Webhooks**

```
user.created → Restore or create User record
user.deleted → Soft delete User record
user.updated → Sync profile changes
```

#### **Stripe Webhooks**

```
customer.subscription.created → Enable dashboard access
customer.subscription.deleted → Disable dashboard access
invoice.payment_succeeded → Update billing status
invoice.payment_failed → Send notification
```

#### **Resend Webhooks** (Future)

```
email.delivered → Update delivery status
email.bounced → Handle bounce
email.complained → Handle spam complaint
```

## 6. Error Handling & Edge Cases

### 6.1 Reservation Conflicts

```
Double booking attempt → Real-time availability check → Error response
```

- Optimistic locking
- Real-time availability updates
- Clear error messages
- Alternative time suggestions

### 6.2 Payment Failures

```
Payment failure → Webhook → Grace period → Access restriction
```

- Dunning management
- Grace period for access
- Payment retry mechanisms
- Customer notifications

### 6.3 Email Delivery Issues

```
Email failure → Retry logic → Alternative delivery → Manual intervention
```

- Automatic retry mechanisms
- Fallback email addresses
- Admin notifications
- Manual resolution tools

## 7. Performance & Scalability

### 7.1 Database Optimization

- Indexed queries for reservations
- Connection pooling
- Query optimization
- Caching strategies

### 7.2 Real-time Updates

- Supabase subscriptions
- Optimistic UI updates
- Conflict resolution
- Offline support (future)

### 7.3 Email Queue Management

- Batch processing
- Rate limiting
- Priority queues
- Failure handling

## 8. Security Considerations

### 8.1 Data Protection

- Encryption at rest and in transit
- PII handling compliance
- GDPR compliance
- Data retention policies

### 8.2 Access Control

- Multi-factor authentication (future)
- Role-based permissions (future)
- API rate limiting
- Audit logging

### 8.3 Token Security

- Secure cancellation tokens
- Token expiration
- One-time use enforcement
- Cryptographic security

## 9. Monitoring & Analytics

### 9.1 Application Monitoring

- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- User analytics

### 9.2 Business Metrics

- Reservation conversion rates
- Customer satisfaction
- Revenue tracking
- Usage patterns

## 10. Future Enhancements

### 10.1 Advanced Features

- Table management
- Waitlist functionality
- Deposit collection
- Menu integration

### 10.2 Mobile Applications

- Native iOS/Android apps
- Push notifications
- Offline capabilities
- Location services

### 10.3 Advanced Analytics

- Predictive analytics
- Customer segmentation
- Revenue optimization
- Operational insights

---

This comprehensive user flow documentation serves as the single source of truth for understanding how users interact with the platform and how all technical components work together to deliver the complete restaurant reservation experience.
