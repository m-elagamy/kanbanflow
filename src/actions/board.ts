"use server";

import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import type { Board, Column } from "@prisma/client";
import db from "@/lib/db";

import columnsTemplates from "@/app/dashboard/data/columns-templates";
import { boardSchema, type BoardFormSchema } from "@/schemas/board";
import { slugify } from "@/utils/slugify";
import { type ServerActionResult } from "@/lib/types";
import {
  createBoard,
  deleteBoard,
  getBoardBySlug,
  updateBoard,
} from "@/lib/dal/board";
import type { ColumnStatus } from "@/schemas/column";

export const createBoardAction = async (
  boardData: BoardFormSchema,
): Promise<ServerActionResult<Board & { columns: Column[] }>> => {
  const { userId } = await auth();
  if (!userId) unauthorized();

  const validatedData = boardSchema.safeParse(boardData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation Errors",
    };
  }

  const { title, description, template: templateId } = validatedData.data;

  const boardSlug = slugify(title);

  const existingBoard = await db.board.findUnique({
    where: {
      userId_slug: { userId: userId, slug: boardSlug },
    },
    select: { slug: true },
  });

  if (existingBoard) {
    return {
      success: false,
      message: `A board with the name "${title}" already exists.`,
    };
  }

  const template = columnsTemplates.find((t) => t.id === templateId) || {
    status: [],
  };

  const result = await createBoard(
    userId,
    title,
    boardSlug,
    description,
    template?.status as ColumnStatus[],
  );

  if (!result.success) {
    return {
      success: false,
      message: "Failed to create board",
    };
  }

  return {
    success: true,
    message: "Board created successfully.",
    fields: result.data,
  };
};

export const updateBoardAction = async (
  formData: FormData,
): Promise<
  ServerActionResult<Pick<Board, "title" | "description" | "slug">>
> => {
  const { userId } = await auth();
  if (!userId) unauthorized();

  const data = Object.fromEntries(formData.entries());
  const validatedData = boardSchema.omit({ template: true }).safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation Errors",
    };
  }

  const { title, description } = validatedData.data;
  const boardId = formData.get("boardId") as string;

  const existingBoard = await db.board.findUnique({
    where: { id: boardId, userId },
    select: { title: true, description: true },
  });

  if (!existingBoard) {
    return { success: false, message: "Board not found." };
  }

  const titleChanged = existingBoard.title !== title;
  const descriptionChanged = existingBoard.description !== description;

  if (!titleChanged && !descriptionChanged) {
    return {
      success: false,
      message:
        "No changes detected. Please update something before submitting.",
    };
  }

  const newSlug = slugify(title);

  const updatedData: Partial<Pick<Board, "title" | "description" | "slug">> = {
    ...(titleChanged && { title, slug: newSlug }),
    ...(descriptionChanged && { description }),
  };

  const duplicateBoard = await db.board.findFirst({
    where: {
      userId: userId,
      slug: newSlug,
      NOT: { id: boardId },
    },
    select: { title: true },
  });

  if (duplicateBoard) {
    return {
      success: false,
      message: `A board with the name "${title}" already exists.`,
    };
  }

  const result = await updateBoard(boardId, updatedData);

  if (!result.success) {
    return { success: false, message: "Failed to update board" };
  }

  return {
    success: true,
    message: "Board updated successfully",
    fields: result.data,
  };
};

export async function deleteBoardAction(
  boardId: string,
): Promise<ServerActionResult<{ boardId: string }>> {
  await deleteBoard(boardId);
  return {
    success: true,
    message: "Board deleted successfully",
  };
}

export async function deleteAllBoardsAction(userId: string) {
  try {
    await db.board.deleteMany({
      where: { userId },
    });
    revalidatePath("/dashboard", "layout");
    return { success: true, message: "All boards deleted successfully" };
  } catch (error) {
    console.error("Error deleting all boards:", error);
    return { success: false, message: "Failed to delete all boards" };
  }
}

export async function getBoardBySlugAction(userId: string, slug: string) {
  const result = await getBoardBySlug(userId, slug);

  if (!result.success) {
    return {
      success: false,
      message: "Board not found",
    };
  }

  return {
    success: true,
    board: result.data,
  };
}
