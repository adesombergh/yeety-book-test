import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// Zod validation schema for cancellation request
const cancelReservationSchema = z.object({
  cancelToken: z.string().min(1, 'Cancel token is required'),
  reason: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const validationResult = cancelReservationSchema.safeParse(body)

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
          },
        },
      },
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
