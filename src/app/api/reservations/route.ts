import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { EmailService } from '@/lib/services/email'

// Zod validation schema for reservation data
const createReservationSchema = z.object({
  restaurantId: z.number().int().positive(),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  date: z.iso.datetime('Invalid date format'),
  guests: z.number().int().min(1, 'At least 1 guest is required').max(20),
  notes: z.string().optional(),
  turnstileToken: z.string().min(1, 'Turnstile verification is required'),
})

// Function to verify Turnstile token with CloudFlare
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTYLE_SECRET_KEY

  if (!secretKey) {
    console.error('TURNSTYLE_SECRET_KEY is not configured')
    return false
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    )

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const validationResult = createReservationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const {
      restaurantId,
      firstName,
      lastName,
      email,
      phone,
      date,
      guests,
      notes,
      turnstileToken,
    } = validationResult.data

    // Verify Turnstile token
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken)
    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: 'Turnstile verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Generate unique cancel token
    const cancelToken = randomBytes(32).toString('hex')

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        firstName,
        lastName,
        email,
        phone,
        date: new Date(date),
        guests,
        notes: notes || null,
        cancelToken,
        status: 'PENDING',
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

    // Send confirmation email (non-blocking - email failures should not prevent reservation success)
    EmailService.sendReservationConfirmation(reservation, restaurant, email)
      .then((emailResult) => {
        if (emailResult.success) {
          console.log('Confirmation email sent successfully:', {
            emailId: emailResult.id,
            reservationId: reservation.id,
            customerEmail: email,
          })
        } else {
          console.error('Failed to send confirmation email:', emailResult.error)
        }
      })
      .catch((error) => {
        console.error('Email service error:', error)
      })

    return NextResponse.json(
      {
        success: true,
        reservation: {
          id: reservation.id,
          firstName: reservation.firstName,
          lastName: reservation.lastName,
          email: reservation.email,
          phone: reservation.phone,
          date: reservation.date,
          guests: reservation.guests,
          notes: reservation.notes,
          status: reservation.status,
          restaurant: reservation.restaurant,
          cancelToken: reservation.cancelToken,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating reservation:', error)

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A reservation with this information already exists' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
