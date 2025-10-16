import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')

    if (!sig) {
      console.error('Webhook error: No signature provided')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      )
    }

    // Handle events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        )
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const restaurantId = subscription.metadata.restaurantId

  if (!restaurantId) {
    console.error('No restaurantId in subscription metadata')
    return
  }

  try {
    await prisma.restaurant.update({
      where: { id: parseInt(restaurantId) },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
      },
    })

    console.log(
      `Updated restaurant ${restaurantId} with subscription ${subscription.id} (status: ${subscription.status})`
    )
  } catch (error) {
    console.error(`Failed to update restaurant ${restaurantId}:`, error)
    throw error
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const restaurantId = subscription.metadata.restaurantId

  if (!restaurantId) {
    console.error('No restaurantId in subscription metadata')
    return
  }

  try {
    await prisma.restaurant.update({
      where: { id: parseInt(restaurantId) },
      data: {
        subscriptionStatus: 'canceled',
      },
    })

    console.log(`Canceled subscription for restaurant ${restaurantId}`)
  } catch (error) {
    console.error(
      `Failed to cancel subscription for restaurant ${restaurantId}:`,
      error
    )
    throw error
  }
}
