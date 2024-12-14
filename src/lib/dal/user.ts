import db from "../db";
import { User } from "@prisma/client";

export const createUser = async (data: User) => {
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
    include: { boards: true },
  });
};

export const updateUser = async (
  userId: string,
  data: Partial<Pick<User, "name" | "email">>,
): Promise<User> => {
  return db.user.update({
    where: { id: userId },
    data,
  });
};
