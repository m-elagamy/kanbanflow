import db from "../db";
import { Board } from "@prisma/client";

const createBoard = async (
  name: string,
  userId: string,
  slug: string,
  description?: string,
  columns?: string[],
): Promise<Board> => {
  const columnData = columns?.map((column) => ({ name: column })) || [];
  return db.board.create({
    data: {
      name,
      slug,
      description,
      userId,
      columns: columnData.length ? { create: columnData } : undefined,
    },
    include: {
      columns: true,
    },
  });
};

const updateBoard = async (
  boardId: string,
  data: Partial<Pick<Board, "name" | "description">>,
) => {
  return db.board.update({
    where: {
      id: boardId,
    },
    data,
  });
};

const deleteBoard = async (boardId: string) => {
  await db.board.delete({
    where: {
      id: boardId,
    },
  });
};

const getBoardBySlug = async (slug: string) => {
  return db.board.findUnique({
    where: { slug },
    include: { columns: true },
  });
};

export { createBoard, getBoardBySlug, updateBoard, deleteBoard };
