"use server";

import db from "@/lib/db";
import {
  insertUser,
  getUserById,
  getUserBoards,
  getAllUserBoards,
} from "../lib/dal/user";
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

export async function getAllUserBoardsAction(userId: string) {
  try {
    const userBoards = await getAllUserBoards(userId);
    return { success: true, userBoards };
  } catch (error) {
    console.error("Error getting user boards:", error);
    return { success: false, error: "Failed to get user boards" };
  }
}
