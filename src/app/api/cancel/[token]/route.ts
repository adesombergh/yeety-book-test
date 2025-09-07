import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = await prisma.reservationToken.findUnique({
      where: {
        token: params.token,
        type: 'cancellation',
        usedAt: null,
      },
      include: {
        reservation: {
          include: {
            restaurant: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or expired cancellation link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (token.expiresAt && token.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Cancellation link has expired' },
        { status: 410 }
      )
    }

    // Check if reservation is already cancelled
    if (token.reservation.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This reservation has already been cancelled' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      reservation: {
        id: token.reservation.id,
        firstName: token.reservation.firstName,
        lastName: token.reservation.lastName,
        email: token.reservation.email,
        date: token.reservation.date,
        time: token.reservation.time,
        guests: token.reservation.guests,
        restaurant: token.reservation.restaurant,
      },
    })
  } catch (error) {
    console.error('Error fetching reservation for cancellation:', error)
    return NextResponse.json(
      { error: 'Failed to load reservation' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = await prisma.reservationToken.findUnique({
      where: {
        token: params.token,
        type: 'cancellation',
        usedAt: null,
      },
      include: {
        reservation: {
          include: {
            restaurant: true,
          },
        },
      },
    })

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or expired cancellation link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (token.expiresAt && token.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Cancellation link has expired' },
        { status: 410 }
      )
    }

    // Check if reservation is already cancelled
    if (token.reservation.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This reservation has already been cancelled' },
        { status: 410 }
      )
    }

    // Cancel the reservation
    await prisma.$transaction([
      // Update reservation status
      prisma.reservation.update({
        where: { id: token.reservation.id },
        data: { status: 'cancelled' },
      }),
      // Mark token as used
      prisma.reservationToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      }),
    ])

    // Send cancellation emails
    try {
      // Email to customer
      await resend.emails.send({
        from: 'Yeety Book <noreply@yeetybook.com>',
        to: [token.reservation.email],
        subject: `Reservation Cancelled - ${token.reservation.restaurant.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Reservation Cancelled</h1>
            <p>Dear ${token.reservation.firstName} ${token.reservation.lastName},</p>
            <p>Your reservation at <strong>${token.reservation.restaurant.name}</strong> has been cancelled.</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Cancelled Reservation Details</h2>
              <p><strong>Date:</strong> ${token.reservation.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${token.reservation.time}</p>
              <p><strong>Guests:</strong> ${token.reservation.guests}</p>
            </div>

            <p>If you would like to make a new reservation, please visit our booking page.</p>
            <p>Thank you for your understanding.</p>
            <p>Best regards,<br>${token.reservation.restaurant.name}</p>
          </div>
        `,
      })

      // Email to restaurant
      if (token.reservation.restaurant.email) {
        await resend.emails.send({
          from: 'Yeety Book <noreply@yeetybook.com>',
          to: [token.reservation.restaurant.email],
          subject: `Reservation Cancelled - ${token.reservation.firstName} ${token.reservation.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Reservation Cancelled</h1>
              <p>A reservation has been cancelled:</p>

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Customer:</strong> ${token.reservation.firstName} ${token.reservation.lastName}</p>
                <p><strong>Email:</strong> ${token.reservation.email}</p>
                ${token.reservation.phone ? `<p><strong>Phone:</strong> ${token.reservation.phone}</p>` : ''}
                <p><strong>Date:</strong> ${token.reservation.date.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${token.reservation.time}</p>
                <p><strong>Guests:</strong> ${token.reservation.guests}</p>
              </div>

              <p>Reservation ID: ${token.reservation.id}</p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      console.error('Failed to send cancellation emails:', emailError)
      // Don't fail the cancellation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { error: 'Failed to cancel reservation' },
      { status: 500 }
    )
  }
}
