import type { Reservation, Restaurant } from '@prisma/client'

/**
 * Format a Date object to RFC 5545 compliant ICS date format (YYYYMMDDTHHMMSSZ)
 * @param date - The date to format
 * @returns Formatted date string in UTC
 */
function formatICSDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

/**
 * Escape special characters in ICS text fields according to RFC 5545
 * @param text - The text to escape
 * @returns Escaped text safe for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/;/g, '\\;') // Escape semicolons
    .replace(/,/g, '\\,') // Escape commas
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '') // Remove carriage returns
}

/**
 * Generate RFC 5545 compliant .ics calendar invite file content
 * @param reservation - The reservation data
 * @param restaurant - The restaurant data
 * @returns .ics file content as string
 */
export function generateCalendarInvite(
  reservation: Reservation,
  restaurant: Restaurant
): string {
  // Use the reservation date directly (it already contains date and time)
  const startDate = new Date(reservation.date)

  // Create end date/time (2 hours after start)
  const endDate = new Date(startDate)
  endDate.setHours(startDate.getHours() + 2)

  // Generate unique identifier for the event
  const uid = `reservation-${reservation.id}@yeety.be`

  // Create timestamp for when this invite was created
  const createdDate = new Date()

  // Prepare event details
  const summary = escapeICSText(`Reservation at ${restaurant.name}`)
  const description = escapeICSText(
    `Reservation for ${reservation.guests} guest${
      reservation.guests > 1 ? 's' : ''
    }` +
      (reservation.notes ? `\n\nNotes: ${reservation.notes}` : '') +
      `\n\nContact: ${restaurant.emailContact}` +
      (restaurant.phoneContact ? `\nPhone: ${restaurant.phoneContact}` : '')
  )

  // Use restaurant name as location (address would be better but not in current schema)
  const location = escapeICSText(restaurant.name)

  // Build the .ics file content according to RFC 5545
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YeetyBook//Reservation System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(createdDate)}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `STATUS:CONFIRMED`,
    `TRANSP:OPAQUE`,
    `SEQUENCE:0`,
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${summary}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}

/**
 * Generate filename for the calendar invite
 * @param reservation - The reservation data
 * @param restaurant - The restaurant data
 * @returns Suggested filename for the .ics file
 */
export function generateCalendarInviteFilename(
  reservation: Reservation,
  restaurant: Restaurant
): string {
  const date = new Date(reservation.date).toISOString().split('T')[0]
  const restaurantSlug = restaurant.slug.replace(/[^a-z0-9]/gi, '-')
  return `reservation-${restaurantSlug}-${date}.ics`
}

/**
 * Validate that a reservation has the required fields for calendar invite generation
 * @param reservation - The reservation data
 * @param restaurant - The restaurant data
 * @returns Object with validation result and error message if invalid
 */
export function validateCalendarInviteData(
  reservation: Reservation,
  restaurant: Restaurant
): { valid: boolean; error?: string } {
  if (!reservation.date) {
    return { valid: false, error: 'Reservation date is required' }
  }

  if (!restaurant.name) {
    return { valid: false, error: 'Restaurant name is required' }
  }

  if (!restaurant.emailContact) {
    return { valid: false, error: 'Restaurant email contact is required' }
  }

  // Validate that the reservation date is a valid Date object
  const reservationDate = new Date(reservation.date)
  if (isNaN(reservationDate.getTime())) {
    return { valid: false, error: 'Invalid reservation date' }
  }

  return { valid: true }
}
