import prisma from '@/lib/prisma';
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await request.json()
    console.log(payload)

    if (payload.type === "user.created") {
    const { id, email_addresses } = payload.data
    await prisma.user.create({
      data: {
        id, // Clerk userId
        email: email_addresses[0].email_address,
      },
    })
  }

    // process the event

    // everything went well
    return Response.json({ message: 'Received' })
  } catch (e) {
    // something went wrong
    console.log(e)
    // no changes were made to the database
    return Response.error()
  }
}