import db from "../db";
import { Column } from "@prisma/client";

export const createColumn = async (
  boardId: string,
  title: string,
): Promise<Column> => {
  return db.column.create({
    data: {
      title,
      boardId,
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
