import prisma from '@/lib/prisma'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await request.json()

    if (payload.type === 'user.created') {
      const { id: clerkId, email_addresses } = payload.data
      const email = email_addresses[0].email_address

      // 1. Try to find user by email
      const existing = await prisma.user.findUnique({
        where: { email },
      })

      if (existing) {
        // If user was soft deleted → restore it
        await prisma.user.update({
          where: { email },
          data: {
            clerkId,
            deletedAt: null,
          },
        })
      } else {
        // Otherwise create a brand new user
        await prisma.user.create({
          data: {
            clerkId,
            email,
          },
        })
      }
    }

    if (payload.type === 'user.deleted') {
      const { id: clerkId } = payload.data

      // Soft delete + unlink Clerk ID
      await prisma.user.updateMany({
        where: { clerkId },
        data: {
          deletedAt: new Date(),
          clerkId: null,
        },
      })
    }

    // everything went well
    return Response.json({ message: 'Received' })
  } catch (e) {
    // something went wrong
    console.log(e)
    // no changes were made to the database
    return Response.error()
  }
}
