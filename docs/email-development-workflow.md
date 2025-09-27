# Email Development Workflow

## Overview

This project uses React Email for developing and previewing email templates. The email preview server provides a visual interface for testing email templates with hot reloading during development.

## Email Templates

Email templates are located in two places:

- **Source templates**: `src/components/emails/` - The actual React components used in production
- **Preview wrappers**: `emails/` - Wrapper components with sample data for the preview server

### Available Templates

1. **Reservation Confirmation** (`reservation-confirmation.tsx`)
   - Sent when a customer makes a reservation
   - Includes reservation details, restaurant info, and cancellation link
   - Supports French locale with sample data

2. **Cancellation Confirmation** (`cancellation-confirmation.tsx`)
   - Sent when a reservation is cancelled
   - Includes cancelled reservation details and restaurant contact info
   - Supports French locale with sample data

## Development Commands

### Start Email Preview Server

```bash
pnpm email:dev
```

This starts the React Email preview server on port 3001 (to avoid conflicts with the main Next.js dev server on port 3000).

- **URL**: <http://localhost:3001>
- **Features**:
  - Visual preview of all email templates
  - Hot reloading when templates are modified
  - Mobile and desktop preview modes
  - Export to HTML functionality

### Build Email Templates

```bash
pnpm email:build
```

Builds all email templates for production use.

## Development Workflow

1. **Start the preview server**:

   ```bash
   pnpm email:dev
   ```

2. **Open the preview interface**:
   Navigate to <http://localhost:3001> in your browser

3. **Edit email templates**:
   - Modify files in `src/components/emails/`
   - Changes will be reflected immediately in the preview server
   - Use the sample data in `emails/` wrappers to test different scenarios

4. **Test responsiveness**:
   - Use the preview server's mobile/desktop toggle
   - Test with different email clients using the export functionality

## Sample Data

The preview wrappers include realistic French sample data:

- **Restaurant**: "Le Petit Bistrot" with French contact details
- **Reservations**: Various scenarios with French names and preferences
- **Dates**: Future dates for realistic testing
- **Locale**: Set to French (`fr`) to match the application's default locale

## Email Template Structure

All email templates follow these patterns:

- **TypeScript interfaces** for type safety
- **Multi-language support** (currently French-focused)
- **Inline styles** for maximum email client compatibility
- **Table-based layouts** for consistent rendering
- **YeetyBook branding** with consistent colors and styling

## Integration with Application

Email templates are integrated into the application through:

- **Email service**: `src/lib/services/email.ts`
- **API routes**: Reservation and cancellation endpoints
- **Resend integration**: For actual email delivery

## Best Practices

1. **Always test in preview server** before deploying changes
2. **Use inline styles** for email client compatibility
3. **Test with realistic data** using the sample data patterns
4. **Maintain consistent branding** across all templates
5. **Keep templates responsive** for mobile email clients

## Troubleshooting

- **Port conflicts**: The email preview server runs on port 3001 by default
- **Template not showing**: Ensure the wrapper file in `emails/` properly imports the source template
- **Hot reloading not working**: Restart the preview server with `pnpm email:dev`
- **Build errors**: Check TypeScript compilation with `pnpm typecheck`
