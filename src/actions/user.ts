"use server";

import { insertUser, getUserById, getUserBoards } from "../lib/dal/user";
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

export async function getUserByIdAction(userId: string) {
  try {
    const user = await getUserById(userId);
    return { success: true, user };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error: "Failed to get user" };
  }
}

export async function getUserBoardsAction(userId: string) {
  try {
    const userWithBoards = await getUserBoards(userId);
    return { success: true, userWithBoards };
  } catch (error) {
    console.error("Error getting user boards:", error);
    return { success: false, error: "Failed to get user boards" };
  }
}
