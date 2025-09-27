import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { EmailService } from '@/lib/services/email'
import { getLocaleFromHeaders } from '@/lib/utils/locale'
import { getTranslations } from 'next-intl/server'

// Function to create localized cancellation schema
async function createCancelReservationSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: 'validation' })

  return z.object({
    cancelToken: z.string().min(1, t('required')),
    reason: z.string().optional(),
  })
}

export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Get locale from request headers
    const locale = getLocaleFromHeaders(request.headers)

    // Create localized schema and validate request data
    const schema = await createCancelReservationSchema(locale)
    const validationResult = schema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { cancelToken, reason } = validationResult.data

    // Find reservation by cancel token
    const reservation = await prisma.reservation.findUnique({
      where: { cancelToken },
      include: {
        restaurant: {
          select: {
            name: true,
            slug: true,
            emailContact: true,
            phoneContact: true,
          },
        },
      },
    })

    if (!reservation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired cancellation link',
        },
        { status: 404 }
      )
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'CANCELLED') {
      return NextResponse.json(
        {
          success: false,
          error: 'This reservation has already been cancelled',
        },
        { status: 400 }
      )
    }

    // Check if reservation is in the past
    const now = new Date()
    if (reservation.date < now) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot cancel a reservation that has already passed',
        },
        { status: 400 }
      )
    }

    // Get full restaurant object for email service
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: reservation.restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: 'Restaurant not found',
        },
        { status: 404 }
      )
    }

    // Update reservation status to cancelled
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        notes: reason
          ? `${
              reservation.notes ? reservation.notes + '\n\n' : ''
            }Cancellation reason: ${reason}`
          : reservation.notes,
      },
      include: {
        restaurant: {
          select: {
            name: true,
            slug: true,
            emailContact: true,
            phoneContact: true,
          },
        },
      },
    })

    // Send cancellation confirmation email (non-blocking - email failures should not prevent cancellation success)
    EmailService.sendCancellationConfirmation(
      updatedReservation,
      restaurant,
      updatedReservation.email
    )
      .then((emailResult) => {
        if (emailResult.success) {
          console.log('Cancellation confirmation email sent successfully:', {
            emailId: emailResult.id,
            reservationId: updatedReservation.id,
            customerEmail: updatedReservation.email,
          })
        } else {
          console.error(
            'Failed to send cancellation confirmation email:',
            emailResult.error
          )
        }
      })
      .catch((error) => {
        console.error('Email service error:', error)
      })

    return NextResponse.json({
      success: true,
      reservation: {
        id: updatedReservation.id,
        firstName: updatedReservation.firstName,
        lastName: updatedReservation.lastName,
        email: updatedReservation.email,
        date: updatedReservation.date,
        guests: updatedReservation.guests,
        status: updatedReservation.status,
        restaurant: updatedReservation.restaurant,
        cancelledAt: updatedReservation.cancelledAt,
      },
    })
  } catch (error) {
    console.error('Error cancelling reservation:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
