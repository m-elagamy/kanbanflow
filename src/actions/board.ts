"use server";

import { redirect, RedirectType } from "next/navigation";
import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";
import type { Board } from "@prisma/client";
import db from "@/lib/db";

import columnsTemplates from "@/app/dashboard/data/columns-templates";
import { boardSchema, type BoardFormSchema } from "@/schemas/board";
import { slugify } from "@/utils/slugify";
import { BoardActionState, type ServerActionResult } from "@/lib/types";
import {
  createBoard,
  deleteBoard,
  getBoardBySlug,
  updateBoard,
} from "@/lib/dal/board";

export const createBoardAction = async (
  _prevState: BoardActionState,
  formData: FormData,
): Promise<BoardActionState> => {
  const user = await currentUser();
  if (!user) return { success: false, message: "Authentication required!" };

  const data = Object.fromEntries(formData.entries());
  const validatedData = boardSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation Errors",
      fields: data as BoardFormSchema,
    };
  }

  const { title, description, template: templateId } = validatedData.data;

  const boardSlug = slugify(title);

  const existingBoard = await db.board.findUnique({
    where: {
      userId_slug: { userId: user.id, slug: boardSlug },
    },
    select: { slug: true },
  });

  if (existingBoard) {
    return {
      success: false,
      message: `A board with the name "${title}" already exists.`,
      fields: validatedData.data,
    };
  }

  const template = columnsTemplates.find((t) => t.id === templateId);

  const result = await createBoard(
    user.id,
    title,
    boardSlug,
    description,
    template?.columns,
  );

  if (!result.success) {
    return {
      success: false,
      message: "Failed to create board",
    };
  }

  redirect(`/dashboard/${boardSlug}`);
};

export const updateBoardAction = async (
  _prevState: BoardActionState,
  formData: FormData,
): Promise<BoardActionState> => {
  const user = await currentUser();
  if (!user) return { success: false, message: "Authentication required!" };

  const data = Object.fromEntries(formData.entries());
  const validatedData = boardSchema.omit({ template: true }).safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation Errors",
      fields: data as BoardFormSchema,
    };
  }

  const { title, description } = validatedData.data;
  const boardId = formData.get("boardId") as string;

  const existingBoard = await db.board.findUnique({
    where: { id: boardId, userId: user.id },
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
      fields: validatedData.data,
    };
  }

  const newSlug = slugify(title);

  const updateData: Partial<Pick<Board, "title" | "description" | "slug">> = {
    ...(titleChanged && { title, slug: newSlug }),
    ...(descriptionChanged && { description }),
  };

  const duplicateBoard = await db.board.findFirst({
    where: {
      userId: user.id,
      slug: newSlug,
      NOT: { id: boardId },
    },
    select: { title: true },
  });

  if (duplicateBoard) {
    return {
      success: false,
      message: `A board with the name "${title}" already exists.`,
      fields: validatedData.data,
    };
  }

  const result = await updateBoard(boardId, updateData);

  if (!result.success) {
    return { success: false, message: "Failed to update board" };
  }

  if (titleChanged) redirect(`/dashboard/${newSlug}`, RedirectType.replace);

  revalidatePath(`/dashboard/${newSlug}`, "page");
  return { success: true, message: "Board updated successfully" };
};

export async function deleteBoardAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ServerActionResult<{ boardId: string }>> {
  try {
    const boardId = formData.get("boardId") as string;
    await deleteBoard(boardId);
    return {
      success: true,
      message: "Board deleted successfully",
      fields: { boardId },
    };
  } catch (error) {
    console.error("Error deleting board:", error);
    return { success: false, message: "Failed to delete board" };
  } finally {
    redirect("/dashboard");
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
