"use server";

import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import type { ServerActionResult } from "@/lib/types";
import {
  insertUser,
  getAllUserBoards,
  getUserOnboardingState,
  getUserBoardsWithStats,
  getDashboardStats,
} from "../lib/dal/user";
import type { SimplifiedBoard, BoardWithStats } from "@/lib/types/stores/board";

export async function insertUserAction(
  data: Omit<User, "hasCreatedBoardOnce">,
): Promise<ServerActionResult<User>> {
  const { userId } = await auth();

  if (!userId || userId !== data.id) {
    return {
      success: false,
      message: "Authentication required.",
    };
  }

  const result = await insertUser(data);

  if (!result.success || !result.data) {
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

export async function getUserBoardsWithStatsAction(): Promise<
  ServerActionResult<BoardWithStats[]>
> {
  const result = await getUserBoardsWithStats();

  if (!result.success) {
    return {
      success: false,
      message: "Failed to fetch boards.",
    };
  }

  return {
    success: true,
    message: "Boards fetched successfully.",
    fields: result.data,
  };
}

export async function getDashboardStatsAction(): Promise<
  ServerActionResult<{
    totalBoards: number;
    totalTasks: number;
    highPriorityTasks: number;
  }>
> {
  const result = await getDashboardStats();

  if (!result.success) {
    return {
      success: false,
      message: "Failed to fetch dashboard stats.",
    };
  }

  return {
    success: true,
    message: "Dashboard stats fetched successfully.",
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
