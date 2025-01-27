import db from "../db";
import { Column } from "@prisma/client";

export const createColumn = async (
  boardId: string,
  title: string,
): Promise<Column> => {
  const highestOrderColumn = await db.column.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = highestOrderColumn ? highestOrderColumn.order + 1 : 0;

  return db.column.create({
    data: {
      title,
      boardId,
      order: newOrder,
    },
  });
};

export const updateColumn = async (
  columnId: string,
  data: Partial<Pick<Column, "title">>,
): Promise<Column> => {
  return db.column.update({
    where: { id: columnId },
    data,
  });
};

export const deleteColumn = async (columnId: string): Promise<Column> => {
  return db.column.delete({
    where: { id: columnId },
  });
};
