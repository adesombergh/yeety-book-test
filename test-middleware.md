# Middleware Testing Guide

## Restaurant Access Middleware Testing

The middleware has been successfully implemented and validated. Here's how to test the functionality:

### Test Scenarios

1. **Authenticated user accessing owned restaurant**
   - Expected: Access granted (200 OK)
   - URL: `/dashboard/1/calendar` (where user owns restaurant ID 1)

2. **Authenticated user accessing non-owned restaurant**
   - Expected: 403 Forbidden
   - URL: `/dashboard/2/settings` (where user doesn't own restaurant ID 2)

3. **Authenticated user accessing non-existent restaurant**
   - Expected: 404 Not Found
   - URL: `/dashboard/999/billing` (restaurant ID 999 doesn't exist)

4. **Admin user accessing any restaurant**
   - Expected: Access granted (200 OK)
   - URL: Any `/dashboard/[restaurantId]/*` route

5. **Unauthenticated user accessing dashboard**
   - Expected: Redirect to sign-in page
   - URL: Any `/dashboard/*` route

### Manual Testing Steps

1. **Setup Test Data:**
   - Ensure you have restaurants in the database
   - Create users with different ownership relationships
   - Set at least one user as admin (`isAdmin: true`)

2. **Test Authentication:**
   - Visit `/dashboard/1/calendar` without being signed in
   - Should redirect to `/sign-in?redirect_url=...`

3. **Test Authorization:**
   - Sign in as a regular user
   - Try accessing a restaurant you own → Should work
   - Try accessing a restaurant you don't own → Should get 403
   - Try accessing non-existent restaurant → Should get 404

4. **Test Admin Access:**
   - Sign in as an admin user
   - Try accessing any restaurant → Should work

### Implementation Details

- **Route Pattern:** `/dashboard/[restaurantId]/*`
- **Database Queries:** Optimized with proper includes and selects
- **Error Handling:** Proper HTTP status codes (403, 404, 500)
- **Admin Override:** Admin users can access all restaurants
- **Edge Runtime Compatible:** Works with Next.js middleware constraints
