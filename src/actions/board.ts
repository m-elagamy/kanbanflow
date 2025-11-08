"use server";

import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { type Board, type Column } from "@prisma/client";
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
import handlePrismaError from "@/utils/prisma-error-handler";

export const createBoardAction = async (
  boardData: BoardFormSchema,
): Promise<ServerActionResult<Board & { columns: Column[] }>> => {
  const validatedData = boardSchema.safeParse(boardData);
  if (!validatedData.success) {
    return { success: false, message: "Validation Errors" };
  }

  const { title, description, template: templateId } = validatedData.data;
  const boardSlug = slugify(title);
  const template = columnsTemplates.find((t) => t.id === templateId) || {
    status: [],
  };

  try {
    const result = await createBoard(
      title,
      boardSlug,
      description,
      template?.status as ColumnStatus[],
    );

    return {
      success: true,
      message: "Board created successfully",
      fields: result.data,
    };
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  } finally {
    revalidateTag(`user-boards`, "max");
  }
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

  let newSlug: string | undefined;

  if (titleChanged) {
    newSlug = slugify(title);

    const duplicateCount = await db.board.count({
      where: {
        userId,
        slug: newSlug,
        NOT: { id: boardId },
      },
    });

    if (duplicateCount > 0) {
      return {
        success: false,
        message: `A board with the name "${title}" already exists.`,
      };
    }
  }

  const updatedData: Partial<Pick<Board, "title" | "description" | "slug">> = {
    ...(titleChanged && { title, slug: newSlug }),
    ...(descriptionChanged && { description }),
  };

  const result = await updateBoard(boardId, updatedData);

  if (!result.success) {
    return { success: false, message: "Failed to update board" };
  }

  revalidateTag(`user-boards`, "max");

  return {
    success: true,
    message: "Board updated successfully",
    fields: result.data,
  };
};

export async function deleteBoardAction(
  boardId: string,
): Promise<ServerActionResult<{ boardId: string }>> {
  const { userId } = await auth();
  if (!userId) unauthorized();

  await deleteBoard(boardId);

  revalidateTag(`user-boards`, "max");

  return {
    success: true,
    message: "Board deleted successfully",
  };
}

export async function getBoardBySlugAction(slug: string) {
  const result = await getBoardBySlug(slug);

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
