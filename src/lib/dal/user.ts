import { User } from "@prisma/client";
import withAuth from "@/utils/with-DAL-auth";
import db from "../db";

export const insertUser = async (data: User) => {
  return db.user.upsert({
    where: { id: data.id },
    update: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.email ? { email: data.email } : {}),
    },
    create: {
      id: data.id,
      name: data.name,
      email: data.email,
    },
  });
};

export const getAllUserBoards = withAuth(async (userId: string) => {
  return db.board.findMany({
    where: { userId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
    },
  });
});
