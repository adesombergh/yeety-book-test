import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

// GET - Fetch billing info from Stripe
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const restaurantId = searchParams.get('restaurantId')

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      )
    }

    // Get restaurant and verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(restaurantId) },
      include: { owners: true },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Check if user is owner
    const isOwner = restaurant.owners.some((owner) => owner.clerkId === user.id)
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!restaurant.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      )
    }

    // Fetch customer from Stripe
    const customer = await stripe.customers.retrieve(
      restaurant.stripeCustomerId
    )

    if (customer.deleted) {
      return NextResponse.json(
        { error: 'Customer has been deleted' },
        { status: 404 }
      )
    }

    // Fetch tax IDs
    const taxIds = await stripe.customers.listTaxIds(
      restaurant.stripeCustomerId
    )

    return NextResponse.json({
      name: customer.name || '',
      address: {
        line1: customer.address?.line1 || '',
        line2: customer.address?.line2 || '',
        postal_code: customer.address?.postal_code || '',
        city: customer.address?.city || '',
        country: customer.address?.country || 'BE',
      },
      vatNumber: taxIds.data.find((tax) => tax.type === 'eu_vat')?.value || '',
    })
  } catch (error) {
    console.error('Error fetching billing info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing info' },
      { status: 500 }
    )
  }
}

// POST - Update billing info in Stripe
// export async function POST(request: NextRequest) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await request.json()
//     const { restaurantId, name, address, vatNumber } = body

//     if (!restaurantId) {
//       return NextResponse.json(
//         { error: 'Restaurant ID is required' },
//         { status: 400 }
//       )
//     }

//     // Get restaurant and verify ownership
//     const restaurant = await prisma.restaurant.findUnique({
//       where: { id: parseInt(restaurantId) },
//       include: { owners: true },
//     })

//     if (!restaurant) {
//       return NextResponse.json(
//         { error: 'Restaurant not found' },
//         { status: 404 }
//       )
//     }

//     // Check if user is owner
//     const isOwner = restaurant.owners.some((owner) => owner.clerkId === user.id)
//     if (!isOwner) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
//     }

//     if (!restaurant.stripeCustomerId) {
//       return NextResponse.json(
//         { error: 'No Stripe customer found' },
//         { status: 404 }
//       )
//     }

//     // Update customer in Stripe
//     await stripe.customers.update(restaurant.stripeCustomerId, {
//       name: name || undefined,
//       address: address
//         ? {
//             line1: address.line1 || undefined,
//             line2: address.line2 || undefined,
//             postal_code: address.postal_code || undefined,
//             city: address.city || undefined,
//             country: 'BE', // Fixed to Belgium
//           }
//         : undefined,
//     })

//     // Handle VAT number
//     if (vatNumber && vatNumber.trim()) {
//       // Get existing tax IDs
//       const existingTaxIds = await stripe.customers.listTaxIds(
//         restaurant.stripeCustomerId
//       )
//       const existingVatId = existingTaxIds.data.find(
//         (tax) => tax.type === 'eu_vat'
//       )

//       // If VAT exists and is different, delete old and create new
//       if (existingVatId && existingVatId.value !== vatNumber.trim()) {
//         await stripe.customers.deleteTaxId(
//           restaurant.stripeCustomerId,
//           existingVatId.id
//         )
//         await stripe.customers.createTaxId(restaurant.stripeCustomerId, {
//           type: 'eu_vat',
//           value: vatNumber.trim(),
//         })
//       } else if (!existingVatId) {
//         // Create new VAT
//         await stripe.customers.createTaxId(restaurant.stripeCustomerId, {
//           type: 'eu_vat',
//           value: vatNumber.trim(),
//         })
//       }
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error updating billing info:', error)
//     return NextResponse.json(
//       { error: 'Failed to update billing info' },
//       { status: 500 }
//     )
//   }
// }
