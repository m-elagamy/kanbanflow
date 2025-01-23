"use server";

import { redirect, RedirectType } from "next/navigation";
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

  //TODO: handle the case when the user choose an exist name for a board without filling out required fields.

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
      userId_title: { userId: user.id, title },
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

  const template = columnsTemplates.find((t) => t.id === templateId);

  const boardSlug = slugify(title);

  await createBoard(title, user.id, boardSlug, description, template?.columns);

  redirect(`/dashboard/${boardSlug}`);
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
        userId_title: { userId: user.id, title },
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

  await updateBoard(boardId, {
    title,
    description,
    slug: slugify(title),
  });

  redirect(`/dashboard/${slugify(title)}`, RedirectType.replace);
};

export async function deleteBoardAction(boardId: string) {
  try {
    const deletedBoard = await deleteBoard(boardId);
    return { success: true, board: deletedBoard };
  } catch (error) {
    console.error("Error deleting board:", error);
    return { success: false, error: "Failed to delete board" };
  } finally {
    redirect("/dashboard");
  }
}

export async function getBoardBySlugAction(slug: string) {
  try {
    const board = await getBoardBySlug(slug);
    return { success: true, board };
  } catch (error) {
    console.error("Error getting board:", error);
    return { success: false, error: "Failed to get board" };
  }
}
