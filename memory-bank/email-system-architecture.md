# Email System Architecture & Implementation Guide

## Overview

This document provides comprehensive documentation for the email system implementation using Resend API integration. The email system completes the customer communication workflow for the restaurant reservation platform.

## System Requirements

### Email Types

1. **Reservation Confirmation Email**
   - Sent immediately after successful reservation creation
   - Includes reservation details and calendar invite (.ics attachment)
   - Clean YeetyBook branding

2. **Cancellation Confirmation Email**
   - Sent after successful reservation cancellation
   - Simple confirmation message
   - No calendar invite needed

### Technical Specifications

- **Email Provider**: Resend API
- **From Address**: `no-reply@yeety.be`
- **Templates**: React-based JSX components
- **Branding**: Clean, minimal YeetyBook branding (no restaurant-specific branding)
- **Languages**: Multi-language support (French/English)
- **Attachments**: RFC 5545 compliant .ics calendar invites

## Architecture Design

### Email Service Layer

```typescript
// src/lib/services/email.ts
export class EmailService {
  static async sendReservationConfirmation(
    reservation: Reservation,
    restaurant: Restaurant,
    customerEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'no-reply@yeety.be',
        to: [customerEmail],
        subject: `Reservation Confirmed - ${restaurant.name}`,
        react: ReservationConfirmationEmail({ reservation, restaurant }),
        attachments: [
          {
            filename: 'reservation.ics',
            content: generateCalendarInvite(reservation, restaurant),
            content_type: 'text/calendar'
          }
        ]
      })

      if (error) {
        console.error('Email sending failed:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: 'Email service unavailable' }
    }
  }

  static async sendCancellationConfirmation(
    reservation: Reservation,
    restaurant: Restaurant,
    customerEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'no-reply@yeety.be',
        to: [customerEmail],
        subject: `Reservation Cancelled - ${restaurant.name}`,
        react: CancellationConfirmationEmail({ reservation, restaurant })
      })

      if (error) {
        console.error('Email sending failed:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: 'Email service unavailable' }
    }
  }
}
```

### Calendar Invite Generation

```typescript
// src/lib/utils/calendar-invite.ts
export function generateCalendarInvite(
  reservation: Reservation,
  restaurant: Restaurant
): string {
  const startDate = new Date(reservation.date + 'T' + reservation.time)
  const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)) // 2 hours default

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YeetyBook//Reservation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${reservation.id}@yeety.be`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:Reservation at ${restaurant.name}`,
    `DESCRIPTION:Reservation for ${reservation.guests} guests\\nSpecial requests: ${reservation.specialRequests || 'None'}`,
    `LOCATION:${restaurant.address}`,
    `ORGANIZER:CN=${restaurant.name}:MAILTO:${restaurant.email}`,
    `ATTENDEE:CN=${reservation.customerName}:MAILTO:${reservation.customerEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}
```

### Email Templates

#### Reservation Confirmation Template

```typescript
// src/components/emails/reservation-confirmation.tsx
import { Html, Head, Body, Container, Heading, Text, Button, Hr } from '@react-email/components'

interface ReservationConfirmationEmailProps {
  reservation: {
    id: string
    date: string
    time: string
    guests: number
    customerName: string
    specialRequests?: string
  }
  restaurant: {
    name: string
    address: string
    phone: string
    email: string
  }
  locale?: string
}

export function ReservationConfirmationEmail({
  reservation,
  restaurant,
  locale = 'en'
}: ReservationConfirmationEmailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const content = {
    en: {
      subject: 'Reservation Confirmed',
      greeting: `Hello ${reservation.customerName},`,
      confirmed: `Your reservation at ${restaurant.name} has been confirmed.`,
      details: 'Reservation Details:',
      date: 'Date',
      time: 'Time',
      guests: 'Guests',
      specialRequests: 'Special Requests',
      restaurantInfo: 'Restaurant Information:',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      footer: 'Thank you for choosing YeetyBook!'
    },
    fr: {
      subject: 'Réservation Confirmée',
      greeting: `Bonjour ${reservation.customerName},`,
      confirmed: `Votre réservation chez ${restaurant.name} a été confirmée.`,
      details: 'Détails de la réservation :',
      date: 'Date',
      time: 'Heure',
      guests: 'Convives',
      specialRequests: 'Demandes spéciales',
      restaurantInfo: 'Informations du restaurant :',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      footer: 'Merci d\'avoir choisi YeetyBook !'
    }
  }

  const t = content[locale as keyof typeof content] || content.en

  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{t.subject}</Heading>

          <Text style={textStyle}>{t.greeting}</Text>
          <Text style={textStyle}>{t.confirmed}</Text>

          <Hr style={hrStyle} />

          <Heading as="h2" style={subHeadingStyle}>{t.details}</Heading>
          <Text style={detailStyle}><strong>{t.date}:</strong> {formatDate(reservation.date)}</Text>
          <Text style={detailStyle}><strong>{t.time}:</strong> {reservation.time}</Text>
          <Text style={detailStyle}><strong>{t.guests}:</strong> {reservation.guests}</Text>
          {reservation.specialRequests && (
            <Text style={detailStyle}><strong>{t.specialRequests}:</strong> {reservation.specialRequests}</Text>
          )}

          <Hr style={hrStyle} />

          <Heading as="h2" style={subHeadingStyle}>{t.restaurantInfo}</Heading>
          <Text style={detailStyle}><strong>{restaurant.name}</strong></Text>
          <Text style={detailStyle}><strong>{t.address}:</strong> {restaurant.address}</Text>
          <Text style={detailStyle}><strong>{t.phone}:</strong> {restaurant.phone}</Text>
          <Text style={detailStyle}><strong>{t.email}:</strong> {restaurant.email}</Text>

          <Hr style={hrStyle} />

          <Text style={footerStyle}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Inline styles for maximum email client compatibility
const bodyStyle = {
  backgroundColor: '#F8F2EB',
  fontFamily: 'Arial, sans-serif',
  margin: 0,
  padding: '20px'
}

const containerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  maxWidth: '600px',
  margin: '0 auto'
}

const headingStyle = {
  color: '#FE6C3B',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center' as const
}

const subHeadingStyle = {
  color: '#02201F',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '15px'
}

const textStyle = {
  color: '#02201F',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '15px'
}

const detailStyle = {
  color: '#02201F',
  fontSize: '14px',
  lineHeight: '1.4',
  marginBottom: '8px'
}

const hrStyle = {
  border: 'none',
  borderTop: '1px solid #E5E5E5',
  margin: '30px 0'
}

const footerStyle = {
  color: '#666666',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px'
}
```

#### Cancellation Confirmation Template

```typescript
// src/components/emails/cancellation-confirmation.tsx
import { Html, Head, Body, Container, Heading, Text, Hr } from '@react-email/components'

interface CancellationConfirmationEmailProps {
  reservation: {
    id: string
    date: string
    time: string
    guests: number
    customerName: string
  }
  restaurant: {
    name: string
    address: string
    phone: string
  }
  locale?: string
}

export function CancellationConfirmationEmail({
  reservation,
  restaurant,
  locale = 'en'
}: CancellationConfirmationEmailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const content = {
    en: {
      subject: 'Reservation Cancelled',
      greeting: `Hello ${reservation.customerName},`,
      cancelled: `Your reservation at ${restaurant.name} has been successfully cancelled.`,
      details: 'Cancelled Reservation Details:',
      date: 'Date',
      time: 'Time',
      guests: 'Guests',
      footer: 'Thank you for using YeetyBook!'
    },
    fr: {
      subject: 'Réservation Annulée',
      greeting: `Bonjour ${reservation.customerName},`,
      cancelled: `Votre réservation chez ${restaurant.name} a été annulée avec succès.`,
      details: 'Détails de la réservation annulée :',
      date: 'Date',
      time: 'Heure',
      guests: 'Convives',
      footer: 'Merci d\'avoir utilisé YeetyBook !'
    }
  }

  const t = content[locale as keyof typeof content] || content.en

  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{t.subject}</Heading>

          <Text style={textStyle}>{t.greeting}</Text>
          <Text style={textStyle}>{t.cancelled}</Text>

          <Hr style={hrStyle} />

          <Heading as="h2" style={subHeadingStyle}>{t.details}</Heading>
          <Text style={detailStyle}><strong>{t.date}:</strong> {formatDate(reservation.date)}</Text>
          <Text style={detailStyle}><strong>{t.time}:</strong> {reservation.time}</Text>
          <Text style={detailStyle}><strong>{t.guests}:</strong> {reservation.guests}</Text>

          <Hr style={hrStyle} />

          <Text style={footerStyle}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Reuse the same styles as confirmation email
const bodyStyle = {
  backgroundColor: '#F8F2EB',
  fontFamily: 'Arial, sans-serif',
  margin: 0,
  padding: '20px'
}

const containerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  maxWidth: '600px',
  margin: '0 auto'
}

const headingStyle = {
  color: '#FE6C3B',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center' as const
}

const subHeadingStyle = {
  color: '#02201F',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '15px'
}

const textStyle = {
  color: '#02201F',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '15px'
}

const detailStyle = {
  color: '#02201F',
  fontSize: '14px',
  lineHeight: '1.4',
  marginBottom: '8px'
}

const hrStyle = {
  border: 'none',
  borderTop: '1px solid #E5E5E5',
  margin: '30px 0'
}

const footerStyle = {
  color: '#666666',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px'
}
```

## API Integration Points

### Reservation Creation API Enhancement

```typescript
// src/app/api/reservations/route.ts (existing file - add email integration)

// After successful reservation creation:
const reservation = await prisma.reservation.create({
  data: validatedData,
  include: {
    restaurant: true
  }
})

// Send confirmation email (non-blocking)
EmailService.sendReservationConfirmation(
  reservation,
  reservation.restaurant,
  validatedData.customerEmail
).catch(error => {
  console.error('Failed to send confirmation email:', error)
  // Log to monitoring service in production
})

return NextResponse.json({ success: true, data: reservation })
```

### Reservation Cancellation API Enhancement

```typescript
// src/app/api/reservations/cancel/route.ts (existing file - add email integration)

// After successful cancellation:
const cancelledReservation = await prisma.reservation.update({
  where: { cancelToken: token },
  data: { status: 'CANCELLED' },
  include: {
    restaurant: true
  }
})

// Send cancellation confirmation email (non-blocking)
EmailService.sendCancellationConfirmation(
  cancelledReservation,
  cancelledReservation.restaurant,
  cancelledReservation.customerEmail
).catch(error => {
  console.error('Failed to send cancellation email:', error)
  // Log to monitoring service in production
})

return NextResponse.json({ success: true, data: cancelledReservation })
```

## Error Handling Strategy

### Non-Blocking Email Operations

- Email failures NEVER block reservation creation or cancellation
- Always return success for the primary operation (reservation/cancellation)
- Log email errors for monitoring and debugging
- Implement graceful degradation if Resend service is unavailable

### Retry Logic

```typescript
// Enhanced email service with retry logic
static async sendEmailWithRetry(
  emailFunction: () => Promise<any>,
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await emailFunction()
      return { success: true }
    } catch (error) {
      console.error(`Email attempt ${attempt} failed:`, error)

      if (attempt === maxRetries) {
        return { success: false, error: 'Max retries exceeded' }
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  return { success: false, error: 'Unexpected error' }
}
```

## Production Setup Requirements

### Domain Configuration

1. **Resend Dashboard Setup**
   - Add `yeety.be` domain in Resend dashboard
   - Verify domain ownership
   - Configure sending reputation

2. **DNS Records Configuration**

   ```
   # SPF Record
   TXT @ "v=spf1 include:_spf.resend.com ~all"

   # DKIM Record (provided by Resend after domain verification)
   TXT resend._domainkey "v=DKIM1; k=rsa; p=[public-key-from-resend]"

   # DMARC Record
   TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@yeety.be"
   ```

3. **Environment Variables**

   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
   ```

### Rate Limits & Monitoring

- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Paid Tier**: Higher limits as needed
- **Monitoring**: Track email delivery rates and bounce rates
- **Alerts**: Set up alerts for high bounce rates or delivery failures

## Testing Strategy

### Development Testing

1. **Email Templates**: Use Resend's preview functionality
2. **Calendar Invites**: Test .ics file generation and import
3. **Multi-language**: Test both French and English templates
4. **Error Handling**: Test with invalid email addresses and service failures

### Production Testing

1. **Domain Verification**: Ensure all DNS records are properly configured
2. **Deliverability**: Test emails to major providers (Gmail, Outlook, etc.)
3. **Spam Testing**: Use tools like Mail Tester to check spam scores
4. **Load Testing**: Test email sending under high reservation volumes

## Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Install Resend package and setup environment
- [ ] Create email service utility structure
- [ ] Implement calendar invite generation utility
- [ ] Create basic email templates

### Phase 2: Integration (Week 1)

- [ ] Integrate emails into reservation creation API
- [ ] Integrate emails into cancellation API
- [ ] Test complete email workflow end-to-end
- [ ] Implement error handling and logging

### Phase 3: Production Setup (Week 2)

- [ ] Setup domain verification in Resend
- [ ] Configure DNS records for email delivery
- [ ] Test production email delivery
- [ ] Monitor email delivery rates and performance

### Phase 4: Optimization (Week 2)

- [ ] Implement retry logic for failed emails
- [ ] Add comprehensive error monitoring
- [ ] Optimize email templates for different clients
- [ ] Performance testing and optimization

This comprehensive architecture ensures a robust, scalable email system that enhances the customer experience while maintaining system reliability and performance.
