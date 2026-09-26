import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { deleteUserRecord } from "@/lib/dal/user";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    if (event.type !== "user.deleted") {
      return Response.json({ received: true });
    }

    if (!event.data.id) {
      return Response.json(
        { received: false, message: "Deleted user ID is missing." },
        { status: 400 },
      );
    }

    await deleteUserRecord(event.data.id);

    return Response.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook handling failed:", error);
    return Response.json(
      { received: false, message: "Webhook verification failed." },
      { status: 400 },
    );
  }
}
