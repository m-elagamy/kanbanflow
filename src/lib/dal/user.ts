import { unstable_cache } from "next/cache";
import { User } from "@prisma/client";
import { withUserId } from "@/utils/auth-wrappers";
import db from "../db";
import { BOARDS_LIST_LIMIT } from "../constants";

type UserInsertPayload = Pick<User, "id" | "name" | "email">;

export const insertUser = async (data: UserInsertPayload) => {
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

export const getUserOnboardingState = withUserId(async (userId: string) => {
  const [user, boardsCount] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { hasCreatedBoardOnce: true },
    }),
    db.board.count({ where: { userId } }),
  ]);

  return {
    boardsCount,
    hasCreatedBoardOnce: user?.hasCreatedBoardOnce ?? false,
  };
});

export const markUserHasCreatedBoardOnce = withUserId(
  async (userId: string) => {
    await db.user.updateMany({
      where: { id: userId, hasCreatedBoardOnce: false },
      data: { hasCreatedBoardOnce: true },
    });

    return true;
  },
);

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
