import db from "../db";
import { User } from "@prisma/client";

export const insertUser = async (data: User) => {
  return db.user.create({ data });
};

export const getUserById = async (userId: string) => {
  return db.user.findUnique({
    where: { id: userId },
  });
};

export const getUserBoards = async (userId: string) => {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      boards: {
        orderBy: { order: "asc" },
      },
    },
  });
};

export const getAllUserBoards = async (userId: string) => {
  return db.board.findMany({
    where: { userId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      order: true,
    },
  });
};
