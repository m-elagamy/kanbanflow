import db from "../db";
import { Board } from "@prisma/client";

const createBoard = async (
  title: string,
  userId: string,
  slug: string,
  description?: string | null,
  columns?: string[],
): Promise<Board> => {
  const columnData =
    columns?.filter(Boolean).map((column) => ({ title: column })) || [];
  return db.board.create({
    data: {
      title,
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
  data: Partial<Pick<Board, "title" | "description" | "slug">>,
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
    include: {
      columns: {
        include: {
          tasks: true,
        },
      },
    },
  });
};

export { createBoard, getBoardBySlug, updateBoard, deleteBoard };
