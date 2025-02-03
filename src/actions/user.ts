"use server";

import { insertUser, getAllUserBoards } from "../lib/dal/user";
import { User, Board } from "@prisma/client";
import type { ActionResult } from "@/lib/types";

export async function insertUserAction(
  data: User,
): Promise<ActionResult<User>> {
  const result = await insertUser(data);

  if (!result) {
    return {
      success: false,
      message: "Failed to insert user.",
    };
  }

  return {
    success: true,
    message: "User inserted successfully.",
    data: result?.data,
  };
}

export async function getAllUserBoardsAction(
  userId: string,
): Promise<ActionResult<Omit<Board, "userId">[]>> {
  const result = await getAllUserBoards(userId);

  if (!result) {
    return {
      success: false,
      message: "Failed to fetch user boards.",
    };
  }

  return {
    success: true,
    message: "All user boards fetched successfully.",
    data: result.data,
  };
}
