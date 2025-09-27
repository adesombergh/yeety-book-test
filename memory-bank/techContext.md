# Tech Context - Technology Stack & Development Setup

## Core Technology Stack

### Frontend Framework

**Next.js 15+ with App Router**

- **Hosting**: Vercel for serverless deployment
- **Routing**: App Router with file-based routing
- **Rendering**: Server components by default, client components only when needed
- **TypeScript**: Mandatory everywhere, strict mode enabled
- **Package Manager**: pnpm for fast, efficient dependency management

### Styling & UI System

**TailwindCSS + shadcn/ui Foundation**

- **Base Framework**: TailwindCSS for utility-first styling
- **Component Library**: shadcn/ui as the foundational component system
- **Design Tokens**: `design-tokens.yml` + `tailwind.config.js` for consistent values
- **Custom Components**: `src/components/ui/*` for project-specific wrappers
- **Font**: Bricolage Grotesque for warm, friendly typography

**Design Philosophy**:

- Primary: Orange (#FE6C3B) for CTAs and highlights
- Background: Warm beige (#F8F2EB) for page surfaces
- Text: Dark soft black (#02201F) for high readability
- Radius: rounded-xl for friendly, soft appearance

### Database & ORM

**Supabase PostgreSQL + Prisma ORM**

- **Database**: Supabase managed PostgreSQL
- **ORM**: Prisma for type-safe queries and migrations
- **Client**: `@prisma/client` for database operations
- **Migrations**: Prisma migrate for schema versioning
- **Connection**: Connection pooling via Supabase

**Critical Architecture Rule**: Prisma client ONLY on server-side

- Server components: Direct Prisma queries
- API routes: Prisma for client mutations
- Client components: fetch() to API routes or receive server props
- Database queries: Organized in `src/lib/queries/*`

### Authentication & Authorization

**Clerk for Staff Authentication**

- **Provider**: Clerk for secure authentication
- **User Management**: Automatic user lifecycle handling
- **Session Management**: Persistent sessions across requests
- **Middleware**: Route protection via `clerkMiddleware()`
- **Webhooks**: User creation/deletion sync with database

**User Lifecycle Pattern** (Netflix-style):

- Account deletion: Soft delete with data preservation
- Account restoration: Re-signup with same email restores access
- Data continuity: All restaurants and reservations preserved

### Form Handling & Validation

**React Hook Form + Zod**

- **Forms**: React Hook Form for performant form management
- **Validation**: Zod schemas for type-safe validation
- **Integration**: `@hookform/resolvers/zod` for seamless integration
- **UI**: shadcn/ui Form components for consistent styling
- **Server Validation**: Matching Zod schemas on API routes

### Email & Communications

**Resend for Transactional Emails**

- **Provider**: Resend for reliable email delivery and high deliverability
- **SDK**: `resend` npm package for Next.js App Router integration
- **Templates**: React-based email templates using JSX components
- **Attachments**: Calendar invites (.ics files) for reservation confirmations
- **Security**: Secure cancellation tokens in email links (existing UUID pattern)
- **Branding**: Clean YeetyBook branding (no restaurant-specific branding)
- **From Address**: `no-reply@yeety.be` for all transactional emails

**Email Types & Implementation**:

```typescript
// Email Service Architecture
export class EmailService {
  static async sendReservationConfirmation(
    reservation: Reservation,
    restaurant: Restaurant,
    customerEmail: string
  ): Promise<{ success: boolean; error?: string }>

  static async sendCancellationConfirmation(
    reservation: Reservation,
    restaurant: Restaurant,
    customerEmail: string
  ): Promise<{ success: boolean; error?: string }>
}
```

**React Email Templates**:

- `src/components/emails/reservation-confirmation.tsx`
- `src/components/emails/cancellation-confirmation.tsx`
- Inline styles for maximum email client compatibility
- Mobile-responsive design with table-based layouts
- Multi-language support (French/English) via props

**Calendar Invite Generation**:

- RFC 5545 compliant .ics file generation
- `src/lib/utils/calendar-invite.ts` utility
- Includes reservation details, restaurant location, contact info
- 2-hour default duration for reservation events
- Proper timezone handling and date formatting

**Integration Pattern**:

```typescript
// API Integration Example
const reservation = await prisma.reservation.create({...})

// Non-blocking email sending
EmailService.sendReservationConfirmation(reservation, restaurant, email)
  .catch(error => console.error('Email failed:', error))

// Always return success for reservation creation
return NextResponse.json({ success: true, data: reservation })
```

**Error Handling Strategy**:

- Email failures never block reservation operations
- Graceful degradation if Resend service unavailable
- Comprehensive error logging for debugging
- Retry logic for transient delivery failures

### Payment & Billing

**Stripe for Subscription Management**

- **Billing**: Stripe Billing for recurring subscriptions
- **Checkout**: Stripe Checkout for subscription signup
- **Webhooks**: Payment status sync with database
- **VAT**: Stripe Tax for EU VAT compliance
- **Security**: PCI compliance handled by Stripe

### Spam Protection

**CloudFlare Turnstile**

- **Integration**: `@marsidev/react-turnstile` for React components
- **Validation**: Server-side token verification
- **User Experience**: Invisible challenge for seamless UX
- **Security**: Prevents automated reservation spam

## Development Environment

### Local Development Setup

**Required Tools**:

- Node.js 18+ (LTS recommended)
- pnpm package manager
- Git for version control
- VSCode with TypeScript extensions

**Environment Variables**:

```env
# Database
DATABASE_URL=          # Supabase connection string
DIRECT_URL=           # Supabase direct connection

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Email Service
RESEND_API_KEY=       # Resend API key for email sending

# Payment Processing (Future)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Spam Protection
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

**Email Service Configuration**:

- **Domain**: `yeety.be` must be verified in Resend dashboard
- **DNS Records**: SPF, DKIM, and DMARC configuration required
- **Rate Limits**: Resend free tier allows 3,000 emails/month, 100/day
- **Deliverability**: Proper domain authentication ensures high inbox rates

### Development Workflow

**Validation Pipeline**:

1. `pnpm lint` - ESLint validation (must pass)
2. `pnpm typecheck` - TypeScript validation (must pass)
3. `pnpm build` - Next.js build validation (must pass)

**Task Requirements**:

- Each task: 10-30 minutes maximum
- All validation steps must pass before proceeding
- One deliverable at a time with explicit validation
- Clear commit messages for each completed task

### Code Quality Standards

**ESLint Configuration**:

- Next.js recommended rules
- TypeScript strict rules
- React hooks rules
- Accessibility rules (jsx-a11y)

**TypeScript Configuration**:

- Strict mode enabled
- No implicit any
- Strict null checks
- Path mapping for clean imports

## File Organization

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Customer-facing routes
│   │   ├── [restaurantSlug]/
│   │   └── layout.tsx
│   ├── (dashboard)/       # Restaurant management
│   │   ├── dashboard/
│   │   └── layout.tsx
│   ├── api/               # API endpoints
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui + custom wrappers
│   ├── emails/            # React email templates
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── queries/           # Database queries (server-side)
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # Business logic services (email, etc.)
│   ├── utils/             # Utility functions
│   └── prisma.ts          # Prisma client setup
├── layouts/               # Layout components
└── middleware.ts          # Route protection
```

**Email System Files**:

- `src/components/emails/reservation-confirmation.tsx` - Confirmation email template
- `src/components/emails/cancellation-confirmation.tsx` - Cancellation email template
- `src/lib/services/email.ts` - Email service with Resend integration
- `src/lib/utils/calendar-invite.ts` - Calendar invite (.ics) generation utility

### Naming Conventions

**Files**: kebab-case for all files (`restaurant-settings-form.tsx`)
**Components**: PascalCase for React components (`RestaurantSettingsForm`)
**Functions**: camelCase for functions (`getUserRestaurants`)
**Constants**: UPPER_SNAKE_CASE for constants (`MAX_GUESTS_PER_RESERVATION`)

## Integration Architecture

### API Design Patterns

**REST Endpoints**:

- `GET /api/restaurants/[id]` - Fetch restaurant data
- `PATCH /api/restaurants/[id]` - Update restaurant settings
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/calendar` - Calendar data

**Response Format**:

```typescript
// Success response
{ success: true, data: T }

// Error response
{ success: false, error: string, details?: any }
```

### Webhook Handling

**Clerk Webhooks**:

- `user.created` → Create or restore User record
- `user.deleted` → Soft delete User record
- Endpoint: `/api/clerk/webhook`

**Stripe Webhooks**:

- `customer.subscription.created` → Enable dashboard access
- `customer.subscription.deleted` → Disable dashboard access
- `invoice.payment_succeeded` → Update billing status
- Endpoint: `/api/stripe/webhook`

### Real-time Data Flow

**Server Components**:

- Fetch fresh data on each request
- Direct Prisma queries for optimal performance
- Automatic revalidation on navigation

**Client Components**:

- Use React state for immediate UI feedback
- Call API routes for mutations
- Handle loading and error states gracefully

## Deployment & Infrastructure

### Vercel Deployment

**Build Configuration**:

- Automatic deployments from Git
- Preview deployments for pull requests
- Environment variables managed in Vercel dashboard
- Edge functions for optimal performance

**Performance Optimizations**:

- Static generation where possible
- Image optimization via Next.js Image component
- Font optimization with next/font
- Bundle analysis and optimization

### Database Management

**Supabase Configuration**:

- Connection pooling enabled
- Row Level Security (RLS) for data isolation
- Automatic backups and point-in-time recovery
- Real-time subscriptions for live updates

**Migration Strategy**:

- Prisma migrations for schema changes
- Staging environment for testing migrations
- Production migration deployment via CI/CD

## Monitoring & Observability

### Error Tracking

**Sentry Integration** (Future):

- Frontend error tracking
- Backend error monitoring
- Performance monitoring
- User session replay

### Analytics

**Vercel Analytics**:

- Page view tracking
- Performance metrics
- User behavior insights
- Conversion funnel analysis

## Security Considerations

### Data Protection

**Encryption**: All data encrypted at rest and in transit
**Authentication**: Secure session management via Clerk
**Authorization**: Multi-tenant data isolation
**Tokens**: Cryptographically secure cancellation tokens

### API Security

**Rate Limiting**: Prevent abuse of reservation endpoints
**Input Validation**: Zod schemas on all API inputs
**CORS**: Proper cross-origin request handling
**Headers**: Security headers via Next.js configuration

This technical foundation ensures scalable, maintainable, and secure development of the restaurant reservation platform.
