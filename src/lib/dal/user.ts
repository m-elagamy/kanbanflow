import withAuth from "@/utils/with-DAL-auth";
import db from "../db";
import { User } from "@prisma/client";

export const insertUser = withAuth(async (data: User) => {
  const existingUser = await db.user.findUnique({
    where: { id: data.id },
  });

  if (existingUser) {
    return db.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  const userByEmail = await db.user.findUnique({
    where: { email: data.email },
  });

  if (userByEmail) {
    return db.user.update({
      where: { email: data.email },
      data: {
        id: data.id,
        name: data.name,
      },
    });
  }

  return db.user.create({
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
    },
  });
});

export const getAllUserBoards = withAuth(async (userId: string) => {
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
});
