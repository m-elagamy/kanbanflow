"use server";

import { User } from "@prisma/client";
import type { ServerActionResult } from "@/lib/types";
import { insertUser, getAllUserBoards } from "../lib/dal/user";
import type { SimplifiedBoard } from "@/lib/types/stores/board";

export async function insertUserAction(
  data: User,
): Promise<ServerActionResult<Partial<User>>> {
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
    fields: result.data,
  };
}

export async function getAllUserBoardsAction(
  userId: string,
): Promise<ServerActionResult<SimplifiedBoard[]>> {
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
