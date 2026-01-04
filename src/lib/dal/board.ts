import db from "../db";
import { Board, type Column } from "@prisma/client";
import { withUserId, ensureAuthenticated } from "@/utils/auth-wrappers";
import type { ColumnStatus } from "@/schemas/column";
import { BOARDS_LIST_LIMIT } from "../constants";

const createBoard = withUserId(
  async (
    userId: string,
    title: string,
    slug: string,
    description?: string | null,
    columnsStatus?: ColumnStatus[],
  ): Promise<Board & { columns: Column[] }> => {
    const minOrderResult = await db.board.aggregate({
      where: { userId },
      _min: { order: true },
      take: BOARDS_LIST_LIMIT,
    });

    const newOrder = (minOrderResult._min.order ?? 0) - 1;

    return db.board.create({
      data: {
        title,
        slug,
        description,
        userId,
        order: newOrder,
        columns: columnsStatus?.length
          ? {
              create: columnsStatus.map((status, index) => ({
                status,
                order: index,
              })),
            }
          : undefined,
      },
      include: { columns: true },
    });
  },
);

const updateBoard = ensureAuthenticated(
  async (
    boardId: string,
    data: Partial<Omit<Board, "id" | "userId" | "order">>,
  ) => {
    return db.board.update({
      where: {
        id: boardId,
      },
      data,
    });
  },
);

const deleteBoard = ensureAuthenticated(async (boardId: string) => {
  await db.board.delete({
    where: {
      id: boardId,
    },
  });
});

const getBoardBySlug = withUserId(async (userId: string, slug: string) => {
  return db.board.findUnique({
    where: { userId_slug: { userId, slug } },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      columns: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          status: true,
          order: true,
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              priority: true,
              description: true,
              columnId: true,
              dueDate: true,
            },
          },
        },
      },
    },
  });
});

export { createBoard, getBoardBySlug, updateBoard, deleteBoard };
