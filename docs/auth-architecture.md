# Authentication Architecture

This document defines the authentication route structure and protected route groups for the yeety-book multi-tenant restaurant reservation SaaS platform.

## Route Protection Groups

### Public Routes (No Authentication Required)

These routes are accessible to all users without authentication:

- **Homepage**: `/` - Landing page
- **Restaurant Reservation Flow**:
  - `/[restaurantSlug]/reservation` - Reservation form
  - `/[restaurantSlug]/reservation/success` - Reservation confirmation
  - `/[restaurantSlug]/reservation/cancel/[token]` - Reservation cancellation
- **Authentication Pages**:
  - `/sign-in` - User login page
  - `/sign-up` - User registration page

### Protected Routes (Authentication Required)

These routes require user authentication and will be protected by Clerk middleware:

- **Dashboard Routes**: All routes under `/dashboard/*`
  - `/dashboard` - Dashboard home (restaurant selection)
  - `/dashboard/[restaurantId]/calendar` - Calendar view
  - `/dashboard/[restaurantId]/day/[date]` - Day view
  - `/dashboard/[restaurantId]/reservation/[id]` - Reservation details
  - `/dashboard/[restaurantId]/settings` - Restaurant settings
  - `/dashboard/[restaurantId]/billing` - Billing management

### API Routes Protection

- **Public API Routes**: Reservation creation endpoints (for customer bookings)
- **Protected API Routes**: All dashboard-related APIs, reservation management, restaurant configuration

## Authentication Flow

### For Unauthenticated Users

1. **Accessing Public Routes**: Direct access allowed
2. **Accessing Protected Routes**:
   - Redirect to `/sign-in` page
   - After successful authentication, redirect back to originally requested page

### For Authenticated Users

1. **Dashboard Access**: Full access to all restaurant management features
2. **Multi-tenant Support**: Users can manage multiple restaurants if authorized
3. **Session Management**: Persistent sessions across page refreshes

## User Lifecycle Management (Netflix-like Pattern)

### Overview

The platform implements a "Netflix-like" user lifecycle pattern that allows users to:

- **Cancel anytime**: Delete their account while preserving business data
- **Return later**: Sign up again with the same email address
- **Continue where they left off**: Access their restaurants and reservations seamlessly

### Technical Flow

#### 1. Initial Signup

```
User signs up → Clerk creates account → Webhook creates User record
```

- Clerk provides a unique `clerkId`
- User record created with `clerkId` and `email`
- `deletedAt` remains `null`

#### 2. Account Deletion (Soft Delete)

```
User deletes account → Clerk removes account → Webhook soft-deletes User
```

- `deletedAt` is set to current timestamp
- `clerkId` is cleared (set to `null`)
- `email` remains as stable identifier
- **All restaurants and reservations are preserved**

#### 3. Account Restoration (Re-signup)

```
User re-signs up → Clerk creates new account → Webhook restores existing User
```

- Clerk provides a new `clerkId` (different from original)
- Existing User record found by `email`
- `clerkId` updated to new value
- `deletedAt` cleared (set to `null`)
- **User regains access to all previous restaurants and reservations**

### Database Schema Design

The User model supports this pattern through three key fields:

```prisma
model User {
  id        Int       @id @default(autoincrement()) // Stable internal ID
  clerkId   String?   @unique                       // Nullable, changes on re-signup
  email     String    @unique                       // Stable identifier across lifecycle
  deletedAt DateTime? @map("deleted_at")            // Soft delete timestamp
  // ... other fields
}
```

**Design Decisions:**

- **`email`**: Permanent identifier, never changes
- **`clerkId`**: Nullable and mutable, allows for account unlinking/relinking
- **`deletedAt`**: Soft delete pattern preserves all related data
- **`id`**: Internal stable primary key for foreign key relationships

### Webhook Implementation

The Clerk webhook handles both account creation and deletion:

```typescript
// User Creation/Restoration
if (payload.type === 'user.created') {
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    // Restore soft-deleted account
    await prisma.user.update({
      where: { email },
      data: { clerkId, deletedAt: null }
    })
  } else {
    // Create new account
    await prisma.user.create({ data: { clerkId, email } })
  }
}

// User Deletion (Soft Delete)
if (payload.type === 'user.deleted') {
  await prisma.user.updateMany({
    where: { clerkId },
    data: { deletedAt: new Date(), clerkId: null }
  })
}
```

### Data Preservation Strategy

**What's Preserved:**

- User account record (soft deleted)
- All owned restaurants
- All restaurant reservations
- Restaurant settings and configuration
- Historical business data

**What's Reset:**

- Clerk authentication session
- `clerkId` (new one assigned on re-signup)
- Active authentication state

### Business Benefits

1. **Reduced Churn**: Users can easily return without losing their data
2. **Data Continuity**: Business operations continue seamlessly
3. **Customer Trust**: Users know their data is safe even after account deletion
4. **Compliance**: Supports "right to be forgotten" while preserving business records

### Security Considerations

- **Account Isolation**: Deleted accounts cannot be accessed until re-signup
- **Email Verification**: Clerk handles email verification on re-signup
- **Data Access**: Only the original email owner can restore their account
- **Audit Trail**: `deletedAt` timestamp provides deletion history

## Implementation Strategy

### Phase 1: Route Structure (Current Task 10.5)

- Create placeholder auth pages (`/sign-in`, `/sign-up`)
- Document route protection groups
- Update navigation components with auth links
- All routes remain publicly accessible

### Phase 2: Clerk Integration (Task 11)

- Install and configure Clerk
- Implement `clerkMiddleware()` for route protection
- Replace placeholder auth pages with Clerk components
- Add authentication state management
- Implement redirect logic for protected routes

## Navigation Integration

### Header Component

- **Unauthenticated State**: Show "Sign In" and "Sign Up" links
- **Authenticated State**: Show user profile and "Sign Out" option

### Dashboard Sidebar

- **Authentication Required**: Only visible to authenticated users
- **Navigation Links**: Calendar, Reservations, Settings, Billing
- **User Context**: Display current user and restaurant context

## Security Considerations

- **Route Protection**: Middleware-level protection for all dashboard routes
- **API Security**: Authentication required for all management APIs
- **Session Security**: Secure session management with automatic expiration
- **Multi-tenant Isolation**: Users can only access authorized restaurants

## Future Enhancements

- **Role-based Access Control**: Different permission levels (owner, manager, staff)
- **Organization Management**: Multi-restaurant ownership and team management
- **Advanced Security**: Two-factor authentication, audit logs
