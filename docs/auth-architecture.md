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
