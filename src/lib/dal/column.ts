import withAuth from "@/utils/with-DAL-auth";
import db from "../db";
import { Column } from "@prisma/client";
import type { ColumnStatus } from "@/schemas/column";

export const createColumn = withAuth(
  async (boardId: string, status: ColumnStatus): Promise<Column> => {
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
);

export const updateColumn = withAuth(
  async (columnId: string, data: Partial<Pick<Column, "status">>) => {
    return db.column.update({
      where: { id: columnId },
      data,
    });
  },
);

export const deleteColumn = withAuth(async (columnId: string) => {
  return db.column.delete({
    where: { id: columnId },
  });
});
