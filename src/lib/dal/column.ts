import db from "../db";
import { Column } from "@prisma/client";

export const createColumn = async (
  boardId: string,
  name: string,
): Promise<Column> => {
  return db.column.create({
    data: {
      name,
      boardId,
    },
  });
};

export const updateColumn = async (
  columnId: string,
  data: Partial<Pick<Column, "name">>,
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

export const getColumnById = async (
  columnId: string,
): Promise<Column | null> => {
  return db.column.findUnique({
    where: { id: columnId },
    include: { tasks: true },
  });
};

export const getColumnsByBoardId = async (
  boardId: string,
): Promise<Column[]> => {
  return db.column.findMany({
    where: { boardId },
    include: { tasks: true },
  });
};
