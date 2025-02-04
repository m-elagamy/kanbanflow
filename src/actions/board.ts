"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import {
  createBoard,
  deleteBoard,
  getBoardBySlug,
  updateBoard,
} from "@/lib/dal/board";
import columnsTemplates from "@/app/dashboard/data/columns-templates";
import { boardSchema } from "@/schemas/board";
import { slugify } from "@/utils/slugify";
import db from "@/lib/db";
import type { CreateBoardActionState, EditBoardActionState } from "@/lib/types";

export const createBoardAction = async (
  _prevState: CreateBoardActionState,
  formData: FormData,
): Promise<CreateBoardActionState> => {
  const user = await currentUser();
  if (!user) return { success: false, message: "Authentication required!" };

  const data = Object.fromEntries(formData.entries());
  const validatedData = boardSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      errors: validatedData.error.format(),
      fields: data,
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
      fields: data,
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

  return {
    success: true,
    message: "Board was created successfully",
    boardSlug: `/dashboard/${slugify(title)}`,
  };
};

export const updateBoardAction = async (
  _prevState: EditBoardActionState,
  formData: FormData,
): Promise<EditBoardActionState> => {
  const user = await currentUser();
  if (!user) return { success: false, message: "Authentication required!" };

  const data = Object.fromEntries(formData.entries());
  const validatedData = boardSchema.omit({ template: true }).safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      errors: validatedData.error.format(),
      fields: data,
    };
  }

  const { title, description } = validatedData.data;
  const boardId = formData.get("boardId") as string;

  const currentBoard = await db.board.findUnique({
    where: { id: boardId },
    select: { title: true },
  });

  if (currentBoard?.title !== title) {
    const existingBoard = await db.board.findUnique({
      where: {
        userId_slug: { userId: user.id, slug: slugify(title) },
      },
      select: { title: true },
    });

    if (existingBoard) {
      return {
        success: false,
        message: `A board with the name "${title}" already exists.`,
        fields: data,
      };
    }
  }

  const result = await updateBoard(boardId, {
    title,
    description,
    slug: slugify(title),
  });

  if (!result) {
    return {
      success: false,
      message: "Failed to update board",
    };
  }

  return {
    success: true,
    message: "Board was updated successfully",
    isUpdating: true,
    boardSlug: `/dashboard/${slugify(title)}`,
  };
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
