import "server-only";

import { revalidateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function revalidateUserBoards() {
  const { userId } = await auth();
  if (!userId) return;

  revalidateTag(`user-boards-${userId}`, "max");
}
