"use server";

import { insertUser, getAllUserBoards } from "../lib/dal/user";
import { User, Board } from "@prisma/client";
import type { ServerActionResult } from "@/lib/types";

export async function insertUserAction(
  data: User,
): Promise<ServerActionResult<User>> {
  const result = await insertUser(data);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to insert user.",
    };
  }

  return {
    success: true,
    message: "User inserted successfully.",
    fields: result?.data,
  };
}

export async function getAllUserBoardsAction(
  userId: string,
): Promise<ServerActionResult<Omit<Board, "userId">[]>> {
  const result = await getAllUserBoards(userId);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to fetch user boards.",
    };
  }

  return {
    success: true,
    message: "All user boards fetched successfully.",
    fields: result.data,
  };
}
