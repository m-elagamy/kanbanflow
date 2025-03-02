import db from "../db";
import { Board, type Column } from "@prisma/client";
import withAuth from "@/utils/with-DAL-auth";
import type { ColumnStatus } from "@/schemas/column";

const createBoard = withAuth(
  async (
    userId: string,
    title: string,
    slug: string,
    description?: string | null,
    columnsStatus?: ColumnStatus[],
  ): Promise<Board & { columns: Column[] }> => {
    return db.$transaction(async (prisma) => {
      const lastBoard = await prisma.board.findFirst({
        where: { userId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastBoard ? lastBoard.order + 1 : 0;

      const columnData =
        columnsStatus
          ?.filter(Boolean)
          .map((status, index) => ({ status: status, order: index })) || [];

      return prisma.board.create({
        data: {
          title,
          slug,
          description,
          userId,
          columns: columnData.length ? { create: columnData } : undefined,
          order: newOrder,
        },
        include: {
          columns: true,
        },
      });
    });
  },
);

const updateBoard = withAuth(
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

const deleteBoard = withAuth(async (boardId: string) => {
  await db.board.delete({
    where: {
      id: boardId,
    },
  });
});

const getBoardBySlug = withAuth(async (userId: string, slug: string) => {
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
          boardId: true,
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              priority: true,
              description: true,
              columnId: true,
            },
          },
        },
      },
    },
  });
});

export { createBoard, getBoardBySlug, updateBoard, deleteBoard };
