"use server";

import db from "@/lib/db";
import { insertUser, getAllUserBoards } from "../lib/dal/user";
import { User } from "@prisma/client";

export async function insertUserAction(data: User) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return { success: true, user: existingUser };
    }

    const user = await insertUser(data);
    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getAllUserBoardsAction(userId: string) {
  try {
    const userBoards = await getAllUserBoards(userId);
    return { success: true, userBoards };
  } catch (error) {
    console.error("Error getting user boards:", error);
    return { success: false, error: "Failed to get user boards" };
  }
}
