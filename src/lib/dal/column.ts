import { withOwnership } from "@/utils/auth-wrappers";
import db from "../db";
import { Column } from "@prisma/client";
import type { ColumnStatus } from "@/schemas/column";

const resolveBoardOwnerId = async (boardId: string) => {
  const board = await db.board.findUnique({
    where: { id: boardId },
    select: { userId: true },
  });
  return board?.userId;
};

const resolveColumnOwnerId = async (columnId: string) => {
  const column = await db.column.findUnique({
    where: { id: columnId },
    select: { board: { select: { userId: true } } },
  });
  return column?.board.userId;
};

export const createColumn = withOwnership(
  async (
    userId: string,
    boardId: string,
    status: ColumnStatus,
  ): Promise<Column> => {
    return db.$transaction(async (prisma) => {
      const highestOrderColumn = await prisma.column.findFirst({
        where: { boardId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = highestOrderColumn ? highestOrderColumn.order + 1 : 0;

      return prisma.column.create({
        data: {
          status,
          boardId,
          order: newOrder,
        },
      });
    });
  },
  resolveBoardOwnerId,
);

export const updateColumn = withOwnership(
  async (
    userId: string,
    columnId: string,
    data: Partial<Pick<Column, "status">>,
  ) => {
    return db.column.update({
      where: { id: columnId },
      data,
    });
  },
  resolveColumnOwnerId,
);

export const deleteColumn = withOwnership(
  async (userId: string, columnId: string) => {
    return db.column.delete({
      where: { id: columnId },
    });
  },
  resolveColumnOwnerId,
);
