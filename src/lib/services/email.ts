import { Resend } from 'resend'
import type { Reservation, Restaurant } from '@prisma/client'
import { ReservationConfirmationEmail } from '@/components/emails/reservation-confirmation'
import { CancellationConfirmationEmail } from '@/components/emails/cancellation-confirmation'
import {
  generateCalendarInvite,
  generateCalendarInviteFilename,
  validateCalendarInviteData,
} from '@/lib/utils/calendar-invite'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// TypeScript interfaces for email service responses
export interface EmailResponse {
  success: boolean
  error?: string
  id?: string
}

// Email service class with proper error handling
export class EmailService {
  /**
   * Send reservation confirmation email with calendar invite
   * @param reservation - The reservation data
   * @param restaurant - The restaurant data
   * @param customerEmail - Customer's email address
   * @returns Promise with success/error status
   */
  static async sendReservationConfirmation(
    reservation: Reservation,
    restaurant: Restaurant,
    customerEmail: string
  ): Promise<EmailResponse> {
    try {
      // Validate required environment variable
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY environment variable is not set')
        return { success: false, error: 'Email service not configured' }
      }

      // Validate calendar invite data
      const validation = validateCalendarInviteData(reservation, restaurant)
      if (!validation.valid) {
        console.error('Calendar invite validation failed:', validation.error)
        return { success: false, error: validation.error }
      }

      // Generate calendar invite
      const calendarInvite = generateCalendarInvite(reservation, restaurant)
      const calendarFilename = generateCalendarInviteFilename(
        reservation,
        restaurant
      )

      // Determine locale based on restaurant or default to French
      const locale = 'fr' // Default to French as per project requirements

      // Send email with Resend
      const emailResult = await resend.emails.send({
        from: 'no-reply@yeety.be',
        to: [customerEmail],
        subject:
          locale === 'fr' ? 'Réservation Confirmée' : 'Reservation Confirmed',
        react: ReservationConfirmationEmail({
          reservation: {
            id: reservation.id,
            firstName: reservation.firstName,
            lastName: reservation.lastName,
            email: reservation.email,
            phone: reservation.phone,
            date: reservation.date,
            guests: reservation.guests,
            notes: reservation.notes,
            cancelToken: reservation.cancelToken || '',
          },
          restaurant: {
            name: restaurant.name,
            slug: restaurant.slug,
            emailContact: restaurant.emailContact,
            phoneContact: restaurant.phoneContact,
          },
          locale,
        }),
        attachments: [
          {
            filename: calendarFilename,
            content: Buffer.from(calendarInvite, 'utf-8'),
            contentType: 'text/calendar',
          },
        ],
      })

      console.log('Reservation confirmation email sent successfully:', {
        emailId: emailResult.data?.id,
        customerEmail,
        reservationId: reservation.id,
        restaurantName: restaurant.name,
      })

      return {
        success: true,
        id: emailResult.data?.id || 'unknown-email-id',
      }
    } catch (error) {
      console.error('Failed to send reservation confirmation email:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Send reservation cancellation confirmation email
   * @param reservation - The cancelled reservation data
   * @param restaurant - The restaurant data
   * @param customerEmail - Customer's email address
   * @returns Promise with success/error status
   */
  static async sendCancellationConfirmation(
    reservation: Reservation,
    restaurant: Restaurant,
    customerEmail: string
  ): Promise<EmailResponse> {
    try {
      // Validate required environment variable
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY environment variable is not set')
        return { success: false, error: 'Email service not configured' }
      }

      // Determine locale based on restaurant or default to French
      const locale = 'fr' // Default to French as per project requirements

      // Send cancellation confirmation email with Resend
      const emailResult = await resend.emails.send({
        from: 'no-reply@yeety.be',
        to: [customerEmail],
        subject:
          locale === 'fr' ? 'Réservation Annulée' : 'Reservation Cancelled',
        react: CancellationConfirmationEmail({
          reservation: {
            id: reservation.id,
            firstName: reservation.firstName,
            lastName: reservation.lastName,
            email: reservation.email,
            phone: reservation.phone,
            date: reservation.date,
            guests: reservation.guests,
            notes: reservation.notes,
          },
          restaurant: {
            name: restaurant.name,
            emailContact: restaurant.emailContact,
            phoneContact: restaurant.phoneContact,
          },
          locale,
        }),
      })

      console.log('Cancellation confirmation email sent successfully:', {
        emailId: emailResult.data?.id,
        customerEmail,
        reservationId: reservation.id,
        restaurantName: restaurant.name,
      })

      return {
        success: true,
        id: emailResult.data?.id || 'unknown-email-id',
      }
    } catch (error) {
      console.error('Failed to send cancellation confirmation email:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Validate email service configuration
   * @returns boolean indicating if the service is properly configured
   */
  static isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY
  }
}
