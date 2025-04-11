import { unstable_cache } from "next/cache";
import { User } from "@prisma/client";
import { withUserId } from "@/utils/auth-wrappers";
import db from "../db";
import { BOARDS_LIST_LIMIT } from "../constants";

export const insertUser = async (data: User) => {
  return db.user.upsert({
    where: { id: data.id },
    update: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.email ? { email: data.email } : {}),
    },
    create: {
      id: data.id,
      name: data.name,
      email: data.email,
    },
  });
};

export const getAllUserBoards = withUserId(async (userId: string) => {
  const getCachedBoards = unstable_cache(
    async (uid: string) => {
      return db.board.findMany({
        where: { userId: uid },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
        take: BOARDS_LIST_LIMIT,
      });
    },
    [`boards-list`],
    { tags: [`user-boards`] },
  );

  return getCachedBoards(userId);
});
