import { unstable_cache } from "next/cache";
import { User, type Prisma } from "@prisma/client";
import { withUserId, ensureAuthenticated } from "@/utils/auth-wrappers";
import db from "../db";
import { BOARDS_LIST_LIMIT, BOARDS_PAGE_SIZE } from "../constants";
import type { BoardWithStats } from "../types/stores/board";

const boardWithStatsSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  _count: { select: { columns: true } },
  columns: {
    select: {
      _count: { select: { tasks: true } },
    },
  },
} satisfies Prisma.BoardSelect;

type BoardRowWithStats = Prisma.BoardGetPayload<{
  select: typeof boardWithStatsSelect;
}>;

const toBoardWithStats = (board: BoardRowWithStats): BoardWithStats => ({
  id: board.id,
  title: board.title,
  slug: board.slug,
  description: board.description,
  _count: {
    columns: board._count.columns,
    tasks: board.columns.reduce((sum, col) => sum + col._count.tasks, 0),
  },
});

export const insertUser = ensureAuthenticated(
  async (data: Omit<User, "hasCreatedBoardOnce">) => {
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
  },
);

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
    { tags: [`user-boards-${userId}`] },
  );

  return getCachedBoards(userId);
});

export const getDashboardStats = withUserId(async (userId: string) => {
  const getCachedStats = unstable_cache(
    async (uid: string) => {
      const [totalBoards, totalTasks, highPriorityTasks] = await Promise.all([
        db.board.count({ where: { userId: uid } }),
        db.task.count({
          where: { column: { board: { userId: uid } } },
        }),
        db.task.count({
          where: { priority: "high", column: { board: { userId: uid } } },
        }),
      ]);

      return { totalBoards, totalTasks, highPriorityTasks };
    },
    [`dashboard-stats`],
    { tags: [`user-boards-${userId}`] },
  );

  return getCachedStats(userId);
});

export const getUserBoardsWithStats = withUserId(async (userId: string) => {
  const getCachedBoardsWithStats = unstable_cache(
    async (uid: string): Promise<BoardWithStats[]> => {
      const boards = await db.board.findMany({
        where: { userId: uid },
        orderBy: { order: "asc" },
        select: boardWithStatsSelect,
        take: BOARDS_LIST_LIMIT,
      });

      return boards.map(toBoardWithStats);
    },
    [`boards-with-stats`],
    { tags: [`user-boards-${userId}`] },
  );

  return getCachedBoardsWithStats(userId);
});

export const getUserBoardsPage = withUserId(
  async (
    userId: string,
    page: number,
  ): Promise<{ boards: BoardWithStats[]; totalCount: number }> => {
    const getCachedPage = unstable_cache(
      async (uid: string, pageNumber: number) => {
        const [boards, totalCount] = await Promise.all([
          db.board.findMany({
            where: { userId: uid },
            orderBy: { order: "asc" },
            select: boardWithStatsSelect,
            skip: (pageNumber - 1) * BOARDS_PAGE_SIZE,
            take: BOARDS_PAGE_SIZE,
          }),
          db.board.count({ where: { userId: uid } }),
        ]);

        return { boards: boards.map(toBoardWithStats), totalCount };
      },
      [`boards-with-stats-paginated`],
      { tags: [`user-boards-${userId}`] },
    );

    return getCachedPage(userId, page);
  },
);
