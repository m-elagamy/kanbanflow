"use server";

import { redirect, RedirectType } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import columnsTemplates from "@/app/dashboard/data/columns-templates";
import { boardSchema, type BoardFormSchema } from "@/schemas/board";
import { slugify } from "@/utils/slugify";
import db from "@/lib/db";
import { BoardActionState } from "@/lib/types";
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

  const existingBoard = await db.board.findUnique({
    where: {
      userId_slug: { userId: user.id, slug: slugify(title) },
    },
    select: { slug: true },
  });

  if (existingBoard) {
    return {
      success: false,
      message: `A board with the name "${title}" already exists.`,
      fields: data as BoardFormSchema,
    };
  }

  const template = columnsTemplates.find((t) => t.id === templateId);

  const boardSlug = slugify(title);

  const result = await createBoard(
    user.id,
    title,
    boardSlug,
    description,
    template?.columns,
  );

  if (!result) {
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

  const boardSlug = slugify(title);

  const existingBoard = await db.board.findFirst({
    where: {
      userId: user.id,
      slug: boardSlug,
      NOT: { id: boardId },
    },
    select: { title: true },
  });

  if (existingBoard) {
    return {
      success: false,
      message: `A board with the name "${title}" already exists.`,
      fields: data as BoardFormSchema,
    };
  }

  const result = await updateBoard(boardId, {
    title,
    description,
    slug: boardSlug,
  });

  if (!result) {
    return {
      success: false,
      message: "Failed to update board",
    };
  }

  redirect(`/dashboard/${boardSlug}`, RedirectType.replace);
};

export async function deleteBoardAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  fields?: { boardId: string };
}> {
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
    return { success: false, error: "Failed to delete board" };
  } finally {
    redirect("/dashboard");
  }
}

export async function getBoardBySlugAction(userId: string, slug: string) {
  const result = await getBoardBySlug(userId, slug);

  if (!result) {
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
