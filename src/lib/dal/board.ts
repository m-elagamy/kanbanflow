import db from "../db";
import { Board } from "@prisma/client";

const createBoard = async (
  title: string,
  userId: string,
  slug: string,
  description?: string | null,
  columns?: string[],
): Promise<Board> => {
  const lastBoard = await db.board.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = lastBoard ? lastBoard.order + 1 : 0;

  const columnData =
    columns
      ?.filter(Boolean)
      .map((column, index) => ({ title: column, order: index })) || [];

  return db.board.create({
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
};

const updateBoard = async (
  boardId: string,
  data: Partial<Omit<Board, "id" | "userId" | "order">>,
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
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      columns: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
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
};

export { createBoard, getBoardBySlug, updateBoard, deleteBoard };
