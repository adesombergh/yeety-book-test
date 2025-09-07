import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const createReservationSchema = z.object({
  restaurantSlug: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  guests: z.number().min(1).max(20),
  date: z.string().transform((str) => new Date(str)),
  time: z.string(),
  comments: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createReservationSchema.parse(body)

    // Find the restaurant by slug
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: validatedData.restaurantSlug },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Check if restaurant has active subscription
    if (restaurant.subscriptionStatus !== 'active') {
      return NextResponse.json(
        { error: 'Restaurant is not accepting reservations at this time' },
        { status: 403 }
      )
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        guests: validatedData.guests,
        date: validatedData.date,
        time: validatedData.time,
        comments: validatedData.comments,
      },
    })

    // Generate cancellation token
    const cancellationToken = crypto.randomBytes(32).toString('hex')
    await prisma.reservationToken.create({
      data: {
        reservationId: reservation.id,
        token: cancellationToken,
        type: 'cancellation',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })

    // Send confirmation email
    try {
      const cancellationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cancel/${cancellationToken}`

      await resend.emails.send({
        from: 'Yeety Book <noreply@yeetybook.com>',
        to: [validatedData.email],
        subject: `Reservation Confirmation - ${restaurant.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Reservation Confirmed!</h1>
            <p>Dear ${validatedData.firstName} ${validatedData.lastName},</p>
            <p>Your reservation at <strong>${restaurant.name}</strong> has been confirmed.</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Reservation Details</h2>
              <p><strong>Date:</strong> ${validatedData.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${validatedData.time}</p>
              <p><strong>Guests:</strong> ${validatedData.guests}</p>
              ${validatedData.comments ? `<p><strong>Special Requests:</strong> ${validatedData.comments}</p>` : ''}
            </div>

            <p>If you need to cancel your reservation, please <a href="${cancellationUrl}">click here</a>.</p>

            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>${restaurant.name}</p>
          </div>
        `,
      })

      // Also send notification to restaurant
      if (restaurant.email) {
        await resend.emails.send({
          from: 'Yeety Book <noreply@yeetybook.com>',
          to: [restaurant.email],
          subject: `New Reservation - ${validatedData.firstName} ${validatedData.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">New Reservation</h1>
              <p>You have received a new reservation:</p>

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Customer:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
                <p><strong>Date:</strong> ${validatedData.date.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${validatedData.time}</p>
                <p><strong>Guests:</strong> ${validatedData.guests}</p>
                ${validatedData.comments ? `<p><strong>Special Requests:</strong> ${validatedData.comments}</p>` : ''}
              </div>

              <p>Reservation ID: ${reservation.id}</p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the reservation if email fails
    }

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
    })
  } catch (error) {
    console.error('Error creating reservation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    )
  }
}
