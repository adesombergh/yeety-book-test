# System Patterns - Architecture & Design Decisions

## Core Architectural Patterns

### Multi-Tenant Architecture

**Pattern**: Single application serving multiple restaurants with data isolation

**Implementation**:

- **URL Structure**: `/{locale}/[restaurantSlug]/*` for public, `/{locale}/dashboard/[restaurantId]/*` for private
- **Data Isolation**: Restaurant-scoped queries with user ownership validation
- **Access Control**: Middleware validates user-restaurant relationships
- **Admin Override**: `isAdmin` users can access all restaurants

**Critical Rules**:

- Never expose one restaurant's data to another
- Always validate restaurant ownership before data access
- Use restaurant ID/slug consistently in URLs and queries

### Server-Side Data Architecture (CRITICAL)

**Pattern**: Prisma client ONLY on server-side, never in client components

**Implementation**:

```
Server Components → Direct Prisma queries
API Routes → Prisma queries for client mutations
Client Components → fetch() to API routes OR receive server props
Database Queries → src/lib/queries/* (server-side functions)
```

**Critical Rules**:

- **NEVER** import Prisma client in `"use client"` components
- Client components get data via props from server components
- Client mutations go through API routes
- All database queries live in `src/lib/queries/*`

### Component Architecture

**Pattern**: shadcn/ui as foundation with custom wrappers

**Implementation**:

- **Base Components**: shadcn/ui primitives (Button, Input, Card, etc.)
- **Custom Wrappers**: `src/components/ui/*` for project-specific components
- **Composition**: Build complex UIs by composing shadcn primitives
- **Design Tokens**: All styling via `design-tokens.yml` and `tailwind.config.js`

**Critical Rules**:

- Always use shadcn/ui as the foundation
- Always use cn from @/lib/utils to handle conditional classes
- Never hardcode colors, spacing, or radii - use design tokens
- Custom components must wrap shadcn primitives, not replace them
- Export all custom components from `components/ui/`
- components/ui folder is for atomic design elements
- block level elements should go into 'components/{groupName}. Ex: components/dashboard contains dashboard related components'

## Authentication & Authorization Patterns

### Netflix-Style User Lifecycle

**Pattern**: Soft delete with account restoration capability

**Flow**:

```
Signup → Active Account (clerkId + email)
Delete → Soft Delete (deletedAt set, clerkId cleared, email preserved)
Re-signup → Account Restoration (new clerkId, deletedAt cleared)
```

**Database Design**:

```prisma
model User {
  id        Int       @id @default(autoincrement()) // Stable internal ID
  clerkId   String?   @unique                       // Nullable, changes on re-signup
  email     String    @unique                       // Stable identifier
  deletedAt DateTime? @map("deleted_at")            // Soft delete timestamp
}
```

**Benefits**:

- Users can return without losing restaurant data
- Business continuity maintained
- Compliance with data retention needs

### Route Protection Pattern

**Pattern**: Middleware-based authentication with route groups

**Implementation**:

```
Public Routes: /, /[restaurantSlug]/*, /sign-in, /sign-up
Protected Routes: /dashboard/* (all dashboard functionality)
API Protection: /api/dashboard/* requires authentication
```

**Middleware Logic**:

1. Check Clerk authentication status
2. Validate restaurant ownership for restaurant-specific routes
3. Redirect unauthenticated users to sign-in
4. Return 403 for unauthorized restaurant access

## Data Flow Patterns

### Reservation Flow Pattern

**Pattern**: Customer booking without account creation

**Flow**:

```
Form Submission → Server Validation → Database Insert → Email Queue → Confirmation
```

**Security**:

- CloudFlare Turnstile for spam protection
- Zod validation on both client and server
- Secure cancellation tokens (UUID-based)
- Rate limiting on reservation endpoints

### Real-time Updates Pattern

**Pattern**: Server-side data fetching with optimistic updates

**Implementation**:

- Server components fetch fresh data on each request
- Client components use React state for immediate feedback
- API mutations return updated data for state synchronization
- Error boundaries handle failed operations gracefully

## Database Patterns

### Relationship Design

**Pattern**: Clear ownership hierarchy with soft deletes

**Schema**:

```
User ←→ Restaurant (Many-to-Many via RestaurantOwners)
Restaurant → Reservations (One-to-Many)
Reservation → CancelToken (One-to-One, nullable)
```

**Soft Delete Strategy**:

- Users: `deletedAt` timestamp, preserve all related data
- Restaurants: `deletedAt` timestamp, preserve reservations
- Reservations: Status-based (CANCELLED) rather than deletion

### JSON Configuration Pattern

**Pattern**: Flexible configuration storage for restaurant settings

**Implementation**:

```prisma
openingHours Json // { "monday": [{"start": "09:00", "end": "17:00"}], ... }
```

**Benefits**:

- Flexible daily schedules
- Multiple time slots per day
- Easy to extend with new fields
- Type-safe with Zod validation

## UI/UX Patterns

### Design System Pattern

**Pattern**: Token-based design system with consistent application

**Implementation**:

- **Colors**: Primary orange (#FE6C3B), warm beige background (#F8F2EB)
- **Typography**: Bricolage Grotesque font family
- **Spacing**: Consistent padding/margin via design tokens
- **Radius**: Rounded corners (rounded-xl) for friendly feel

**Philosophy**:

- Soft over sharp (rounded corners, gentle curves)
- Warm over cool (beiges and oranges vs grays)
- Playful over sterile (color variety, friendly microcopy)
- Clear over clever (obvious affordances, high readability)

### Form Patterns

**Pattern**: React Hook Form + Zod validation with shadcn/ui components

**Implementation**:

```typescript
// Schema definition
const schema = z.object({...})

// Form setup
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
})

// Component composition
<Form>
  <FormField>
    <FormItem>
      <FormLabel />
      <FormControl>
        <Input />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</Form>
```

**Benefits**:

- Type-safe form handling
- Consistent validation patterns
- Accessible form components
- Server-side validation matching

## Development Patterns

### Task Granularity Pattern

**Pattern**: Small, testable, incremental steps

**Rules**:

- Each task: 10-30 minutes maximum
- Must pass: `pnpm lint`, `pnpm typecheck`, `pnpm build`
- One deliverable at a time
- Explicit validation criteria

### File Organization Pattern

**Pattern**: Feature-based organization with clear boundaries

**Structure**:

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Customer-facing routes
│   ├── (dashboard)/       # Restaurant management routes
│   └── api/               # API endpoints
├── components/
│   ├── ui/                # shadcn/ui + custom wrappers
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── queries/           # Database queries (server-side)
│   ├── schemas/           # Zod validation schemas
│   └── utils/             # Utility functions
└── layouts/               # Layout components
```

## Integration Patterns

### Email Workflow Pattern

**Pattern**: Transactional emails with secure token-based actions

**Flow**:

```
Trigger → Template Selection → Resend API → Delivery → Action Links
```

**Security**:

- Unique tokens for cancellation links
- Time-based token expiration
- One-time use enforcement
- Secure token generation (crypto.randomUUID())

### Billing Integration Pattern

**Pattern**: Stripe webhooks with database synchronization

**Flow**:

```
Stripe Event → Webhook → Database Update → Access Control Update
```

**Implementation**:

- Subscription status stored in Restaurant model
- Webhook handlers update database state
- Dashboard access controlled by subscription status
- Grace period handling for payment failures

These patterns ensure consistency, security, and maintainability across the entire application.
