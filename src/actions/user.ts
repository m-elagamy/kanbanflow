"use server";

import { User } from "@prisma/client";
import type { ServerActionResult } from "@/lib/types";
import {
  insertUser,
  getAllUserBoards,
  getUserOnboardingState,
} from "../lib/dal/user";
import type { SimplifiedBoard } from "@/lib/types/stores/board";

export async function insertUserAction(
  data: User,
): Promise<ServerActionResult<Partial<User>>> {
  if (!data.id) {
    return {
      success: false,
      message: "Authentication required.",
    };
  }

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
    fields: result,
  };
}

export async function getAllUserBoardsAction(): Promise<
  ServerActionResult<SimplifiedBoard[]>
> {
  const result = await getAllUserBoards();

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

export async function getUserOnboardingStateAction(): Promise<
  ServerActionResult<{ boardsCount: number; hasCreatedBoardOnce: boolean }>
> {
  const result = await getUserOnboardingState();

  if (!result.success || !result.data) {
    return {
      success: false,
      message: "Failed to fetch onboarding state.",
    };
  }

  return {
    success: true,
    message: "Onboarding state fetched successfully.",
    fields: result.data,
  };
}
