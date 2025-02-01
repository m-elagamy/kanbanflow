"use server";

import { insertUser, getAllUserBoards } from "../lib/dal/user";
import { User } from "@prisma/client";

export async function insertUserAction(data: User) {
  try {
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
