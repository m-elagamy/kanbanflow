import db from "../db";
import { User } from "@prisma/client";

export const insertUser = async (data: User) => {
  // First try to find user by ID
  const existingUser = await db.user.findUnique({
    where: { id: data.id },
  });

  // If user exists with this ID, update their details
  if (existingUser) {
    return db.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  // If user doesn't exist with this ID, but might exist with this email
  const userByEmail = await db.user.findUnique({
    where: { email: data.email },
  });

  // If user exists with this email but different ID, handle the conflict
  if (userByEmail) {
    // Option 1: Update the existing user's ID to match Clerk's ID
    return db.user.update({
      where: { email: data.email },
      data: {
        id: data.id,
        name: data.name,
      },
    });
  }

  // If no user exists with this ID or email, create new user
  return db.user.create({
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
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
