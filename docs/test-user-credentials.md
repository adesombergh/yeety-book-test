# Test User Credentials

This document contains the test user credentials for dashboard testing and development.

## Test User Account

**Email:** `aldebaran.desombergh@yeety.be`
**Password:** `Password1!`
**Clerk ID:** `user_32p9CgFG9e6XmK4CXA9R5R4JHuV`
**Admin Status:** `false` (regular user)
**Restaurant Access:** Owner of "Bella Vista" restaurant (first restaurant in seed data)

## Admin User Account

**Email:** `aldebaran.desombergh@gmail.com`
**Clerk ID:** `user_32ZGKoTscBA26GgPABlCCsoAVZx`
**Admin Status:** `true` (admin user)
**Restaurant Access:** Full access to all restaurants (admin privileges)

## Usage Instructions

### For Dashboard Testing

1. Use the **test user account** (`aldebaran.desombergh@yeety.be`) for testing dashboard functionality
2. This user has ownership access to the "Bella Vista" restaurant
3. Login credentials: `aldebaran.desombergh@yeety.be` / `Password1!`

### For Admin Testing

1. Use the **admin user account** (`aldebaran.desombergh@gmail.com`) for testing admin functionality
2. This user has admin privileges and can access all restaurants
3. Password needs to be set up in Clerk dashboard

## Database Seeding

These users are automatically created when running the database seeder:

```bash
pnpm db:seed
```

The seeder will:

- Create both user accounts in the database
- Connect the test user as owner of the first restaurant (Bella Vista)
- Generate sample reservations for all restaurants

## Important Notes

- **Always use the test user account** for dashboard testing to ensure consistent test scenarios
- The test user is specifically connected to restaurant ID 1 (Bella Vista)
- Admin user has global access but should be used sparingly for testing admin-specific features
- These credentials are for development/testing only and should not be used in production
