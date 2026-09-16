import "server-only";

import { updateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function revalidateUserBoards() {
  const { userId } = await auth();
  if (!userId) return;

  updateTag(`user-boards-${userId}`);
}
