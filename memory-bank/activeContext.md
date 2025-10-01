# Active Context - Current Work Focus

## Current Task Focus

### Layout Improvement: Reservation Screen Restructure ✅

**Status**: COMPLETED
**Goal**: Restructure reservation page layout with sticky sidebar

**🎉 LAYOUT UPDATE COMPLETED**: Reservation screen now features optimal two-column layout!

**Key Changes Made**:

- **Two-Column Layout**: Form is now the main content (2/3 width), information panel is sidebar (1/3 width)
- **Sticky Sidebar**: Restaurant information panel sticks to viewport on desktop for easy reference
- **Responsive Design**: Mobile stacked layout, desktop side-by-side layout
- **Improved UX**: Form is now the visual focus, reducing user friction
- **Single Column Info**: Information panel uses vertical stacking instead of cramped grid

### New Task Phase: User Onboarding System 🎯

**Status**: Task planning completed - Ready for implementation
**Goal**: Create comprehensive onboarding flow for new restaurant owners

**🎉 MAJOR MILESTONE ACHIEVED**: All foundation, dashboard, and email system tasks (1-41) are COMPLETE!

**New Task Series (042-049) - Created and Ready**:

**User Onboarding Flow**:

- **Task 042**: Update Restaurant model for optional onboarding fields
- **Task 043**: Create onboarding route structure and layout
- **Task 044**: Enhance middleware for onboarding redirect logic
- **Task 045**: Create restaurant slug generation utility
- **Task 046**: Create onboarding form component
- **Task 047**: Implement restaurant creation server action
- **Task 048**: Add Clerk session token custom claims configuration
- **Task 049**: Test complete onboarding flow end-to-end

**Implementation Priority**: Tasks should be completed in sequence (042-049) as each builds upon the previous.

**Previous Task Series (035-041) - Completed**:

**Internationalization Refinement**:

- **Task 035**: Remove English locale, set French as default ✅
- **Task 036**: Audit application for hardcoded text, implement translation keys ✅

**User Experience Improvements**:

- **Task 037**: Add loading state to reservation form submission ✅
- **Task 038**: Add cursor pointer to button component ✅

**Email System Enhancements**:

- **Task 039**: Add top padding to email templates ✅
- **Task 040**: Implement Google Fonts (Bricolage Grotesque) in emails ✅
- **Task 041**: Set up email preview development workflow ✅

**Next Phase Requirements**:

- **Email Types**: Reservation confirmation and cancellation confirmation
- **Technology**: Resend API with React-based email templates
- **Branding**: Clean, minimal YeetyBook branding (no restaurant-specific branding)
- **From Address**: `no-reply@yeety.be`
- **Calendar Invites**: .ics file attachments for reservation confirmations
- **Integration**: Trigger emails from existing reservation APIs

**Key Implementation Areas**:

1. **Email Service Layer**: Create `src/lib/services/email.ts` for Resend integration
2. **Email Templates**: React components for confirmation and cancellation emails
3. **Calendar Invites**: Utility to generate RFC 5545 compliant .ics files
4. **API Integration**: Add email triggers to reservation creation and cancellation
5. **Production Setup**: Domain verification and DNS configuration for `yeety.be`

**Current Priority**: Begin with email service foundation and template creation

### All Foundation Work - ✅ COMPLETED

**Project Setup & Styling (Tasks 1-11)** - ✅ COMPLETED

- Next.js 15 + TypeScript + pnpm setup
- TailwindCSS + shadcn/ui + design tokens
- Database setup with Supabase + Prisma
- Internationalization with next-intl
- Authentication with Clerk
- Complete routing structure

**Customer Reservation System (Tasks 12-16)** - ✅ COMPLETED

- Complete booking flow with CloudFlare Turnstile protection
- Advanced form components with React Hook Form + Zod
- Database integration with Reservation model
- API endpoints with dual validation
- End-to-end reservation functionality

**Dashboard Foundation (Tasks 17-26)** - ✅ COMPLETED

- Multi-tenant security with user-restaurant ownership validation
- Complete restaurant management with list page and switcher
- Sophisticated 7-day calendar with time slots and reservation display
- Restaurant settings system with opening hours and constraints
- Enhanced reservation cancellation workflow
- All dashboard functionality working end-to-end

## Email System Implementation Plan

### Phase 1: Email Service Foundation

**Dependencies & Setup**:

- Install `resend` package for email API integration
- Add `RESEND_API_KEY` environment variable
- Create email service utility structure

**Email Service Architecture**:

```typescript
// src/lib/services/email.ts
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

### Phase 2: Email Templates & Calendar Invites

**React Email Templates**:

- `src/components/emails/reservation-confirmation.tsx`
- `src/components/emails/cancellation-confirmation.tsx`
- Clean, minimal YeetyBook branding
- Multi-language support (French/English)

**Calendar Invite Generation**:

- `src/lib/utils/calendar-invite.ts`
- RFC 5545 compliant .ics file generation
- Include reservation details, restaurant location, contact info

### Phase 3: API Integration

**Integration Points**:

- **Reservation Creation** (`/api/reservations` POST): Add email sending after successful DB insert
- **Reservation Cancellation** (`/api/reservations/cancel` POST): Add email sending after cancellation

**Error Handling**:

- Email failures should not block reservation creation/cancellation
- Log email errors for monitoring
- Graceful degradation if email service is unavailable

### Phase 4: Production Setup

**Domain Configuration**:

- Setup `yeety.be` domain verification in Resend dashboard
- Configure SPF, DKIM, and DMARC DNS records
- Test email delivery and reputation

## Current Architecture State

### Database Schema

**Models in Use**:

- `User`: With `isAdmin` field, Clerk integration, soft delete pattern
- `Restaurant`: Full configuration fields (opening hours, constraints, contact info)
- `Reservation`: Complete reservation lifecycle with status management

**Key Relationships**:

- User ←→ Restaurant (Many-to-Many via RestaurantOwners relation)
- Restaurant → Reservations (One-to-Many)
- Secure cancellation tokens for email-based cancellation

### Authentication & Access Control

**Current Implementation**:

- Clerk authentication fully integrated
- Route protection middleware working
- Dashboard routes require authentication
- User-restaurant ownership validation in place
- Netflix-style user lifecycle (soft delete/restore) implemented

### Component System

**Current State**:

- shadcn/ui foundation established
- Custom components in `src/components/ui/*`
- Design tokens system working (`design-tokens.yml` + `tailwind.config.js`)
- Form patterns established with React Hook Form + Zod
- Consistent styling across all components

## Active Development Patterns

### Form Development Pattern

**Established Pattern** (from reservation form):

```typescript
// 1. Zod schema definition
const schema = z.object({...})

// 2. React Hook Form setup
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
})

// 3. shadcn/ui Form components
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

### API Endpoint Pattern

**Established Pattern**:

```typescript
// Response format
{ success: true, data: T } | { success: false, error: string }

// Validation with Zod
const result = schema.safeParse(body)
if (!result.success) {
  return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 })
}

// Database operations with Prisma
const updated = await prisma.restaurant.update({...})
```

## Key Learnings & Insights

### Server-Side Data Architecture

**Critical Pattern**: Prisma client ONLY on server-side

- Server components: Direct Prisma queries work perfectly
- Client components: Must use fetch() to API routes
- Database queries: Organized in `src/lib/queries/*` for reusability
- This pattern prevents hydration issues and ensures security

### Multi-Tenant Security

**Access Control Pattern**:

- Always validate user-restaurant ownership before data access
- Use restaurant ID consistently in URLs and database queries
- Admin users (`isAdmin: true`) can access all restaurants
- Middleware handles authentication, components handle authorization

### Design System Integration

**Component Development**:

- Always start with shadcn/ui primitives
- Wrap in custom components in `src/components/ui/*` when needed
- Use design tokens from `design-tokens.yml` - never hardcode values
- Maintain consistent spacing, colors, and typography

### Form Validation Strategy

**Dual Validation**:

- Client-side: React Hook Form + Zod for immediate feedback
- Server-side: Same Zod schemas for security and consistency
- Error handling: Clear, user-friendly messages
- Loading states: Proper feedback during async operations

## Current Challenges & Considerations

### Restaurant Settings Complexity

**Challenge**: Opening hours configuration is complex JSON structure
**Approach**: Use Zod for type-safe validation of nested JSON structure
**Pattern**: `{ "monday": [{"start": "09:00", "end": "17:00"}], ... }`

### Form State Management

**Challenge**: Loading existing restaurant data into form
**Approach**: Use React Hook Form's `reset()` method after data fetch
**Pattern**: Server component loads data, passes to client form component

### API Route Organization

**Current**: `/api/restaurants/[restaurantId]/route.ts` exists
**Need**: PATCH method for updating restaurant settings
**Pattern**: Validate ownership, parse body with Zod, update with Prisma

## Testing Credentials

**Dashboard Access**:

- Email: `aldebaran.desombergh@yeety.be`
- Password: `.G?u+>8d7C&xiy*`
- Role: Restaurant owner with access to test restaurant

## Next Session Priorities

**Immediate Tasks (Ready for Implementation)**:

1. **Task 035**: Remove English locale and set French as default
2. **Task 036**: Audit entire application for hardcoded text and implement translation keys
3. **Task 037**: Add loading state to reservation form submission
4. **Task 038**: Add cursor pointer to button component
5. **Task 039**: Add top padding to email templates
6. **Task 040**: Implement Google Fonts in email templates
7. **Task 041**: Set up email preview development workflow

**Task Methodology**: Each task is designed for 10-15 minutes completion, following project standards.

## Important Context for Memory Resets

**Current Task Context (Tasks 035-041)**:

**Internationalization Requirements**:

- Remove English locale entirely, French-only setup
- Audit entire application for hardcoded text
- Implement translation keys using next-intl patterns
- Update `src/i18n/routing.ts` and `messages/fr.json`

**UX Improvement Requirements**:

- Add loading state to reservation form with proper feedback
- Fix button component cursor styling across all variants
- Enhance email template visual design with padding and fonts

**Email Enhancement Requirements**:

- Add top padding to email templates before white container
- Implement Bricolage Grotesque font: `'Bricolage Grotesque', Arial, Helvetica, sans-serif`
- Set up React Email preview server for development workflow

**Critical Files for Current Tasks**:

- `src/i18n/routing.ts` - Locale configuration
- `messages/en.json` - To be removed
- `messages/fr.json` - Translation keys to be expanded
- `src/components/reservation/form.tsx` - Loading state implementation
- `src/components/ui/button.tsx` - Cursor pointer styling
- `src/components/emails/*.tsx` - Email template enhancements
- `package.json` - Email preview script addition

**Established Patterns to Maintain**:

- Server-side Prisma queries only
- shadcn/ui component foundation
- React Hook Form + Zod validation
- Design tokens for all styling
- Multi-tenant security validation
- Error handling with graceful degradation

**Production Requirements**:

- Domain verification for `yeety.be` in Resend
- DNS configuration (SPF, DKIM, DMARC)
- Email delivery testing and monitoring

This active context ensures continuity across memory resets and maintains focus on email system implementation priorities.
