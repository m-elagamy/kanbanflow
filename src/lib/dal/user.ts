import db from "../db";
import { User } from "@prisma/client";

export const insertUser = async (data: User) => {
  return db.user.create({ data });
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
