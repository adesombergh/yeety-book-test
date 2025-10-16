'use server'

import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import slugo from 'slugo'

export async function createRestaurant(name: string, vatNumber: string) {
  try {
    // Authenticate user
    const user = await currentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Restaurant name is required' }
    }

    if (name.length > 100) {
      return {
        success: false,
        error: 'Restaurant name must be less than 100 characters',
      }
    }

    // Validate VAT number
    if (!vatNumber || vatNumber.trim().length === 0) {
      return { success: false, error: 'VAT number is required' }
    }

    const vatRegex = /^[A-Z]{2}[0-9A-Z]{2,12}$/
    if (!vatRegex.test(vatNumber.trim())) {
      return {
        success: false,
        error: 'Numéro de TVA invalide (ex: BE0123456789)',
      }
    }

    // Check for duplicate VAT number
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { vatNumber: vatNumber.trim() },
    })

    if (existingRestaurant) {
      return {
        success: false,
        error:
          'Un compte existe déjà pour ce numéro de TVA. Essayez de vous connecter ou contactez le support.',
      }
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return { success: false, error: 'User not found' }
    }

    // Generate slug from name
    let slug = slugo(name)
    let slugSuffix = 0

    // Handle duplicate slugs by incrementing suffix
    while (await prisma.restaurant.findUnique({ where: { slug } })) {
      slugSuffix++
      slug = `${slugo(name)}-${slugSuffix}`
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress || dbUser.email,
      metadata: {
        restaurantName: name.trim(),
        userId: dbUser.id.toString(),
      },
      tax_id_data: [{ type: 'eu_vat', value: vatNumber.trim() }],
    })

    // Create restaurant with default values from Task 042 schema
    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        vatNumber: vatNumber.trim(),
        slug,
        stripeCustomerId: customer.id,
        owners: {
          connect: { id: dbUser.id },
        },
        // All other fields use defaults from schema:
        // - emailContact: null
        // - phoneContact: null
        // - openingHours: null
        // - slotInterval: 60
        // - minGuestsPerReservation: 1
        // - maxGuestsPerReservation: 6
        // - maxReservationsPerSlot: 1
        // - reservationLeadTimeMinHours: 60
        // - reservationLeadTimeMaxHours: 129600
        // - subscriptionStatus: null (no subscription yet)
      },
    })

    // Create Stripe Checkout Session with 30-day trial
    let checkoutUrl: string | null = null
    const success_url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${restaurant.id}/settings`
    console.log({ success_url })
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customer.id,
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID!,
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: 30,
          metadata: {
            restaurantId: restaurant.id.toString(),
          },
        },
        success_url,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${restaurant.id}/settings`,
      })
      checkoutUrl = session.url
    } catch (checkoutError) {
      // Log error but don't fail the restaurant creation
      console.error('Failed to create Stripe checkout session:', checkoutError)
    }

    // Return success with restaurant ID and checkout URL for client-side redirect
    return {
      success: true,
      restaurantId: restaurant.id,
      checkoutUrl,
    }
  } catch (error) {
    console.error('Failed to create restaurant:', error)

    // Handle Prisma unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        const prismaError = error as { meta?: { target?: string[] } }
        const target = prismaError.meta?.target
        if (target && target.includes('vat_number')) {
          return {
            success: false,
            error:
              'Un compte existe déjà pour ce numéro de TVA. Essayez de vous connecter ou contactez le support.',
          }
        }
      }
    }

    return {
      success: false,
      error: 'Failed to create restaurant. Please try again.',
    }
  }
}
