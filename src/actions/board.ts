"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import type { Board } from "@prisma/client";

import {
  createBoard,
  deleteBoard,
  getBoardBySlug,
  updateBoard,
} from "@/lib/dal/board";
import columnsTemplates from "@/app/dashboard/data/columns-templates";
import db from "@/lib/db";
import { boardSchema, BoardCreationForm } from "@/schemas/board";
import { slugify } from "@/utils/slugify";
import ensureUniqueSlug from "@/utils/ensure-unique-slug";

export const createBoardAction = async (formData: BoardCreationForm) => {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Authentication required!" };

    const validatedData = boardSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.flatten().fieldErrors,
      };
    }

    const name = validatedData.data.title;
    const description = validatedData.data.description;
    const templateId = validatedData.data.template;

    const template = columnsTemplates.find((t) => t.id === templateId);

    //TODO: Replace this logic with explicit prevention when creating the board.
    const boardSlug = slugify(name);
    const existingSlugs = await db.board.findMany({
      where: { userId: user.id },
      select: { slug: true },
    });
    const uniqueSlug = await ensureUniqueSlug(
      boardSlug,
      existingSlugs.map((b) => b.slug).filter(Boolean),
    );

    await createBoard(
      name,
      user.id,
      uniqueSlug,
      description,
      template?.columns,
    );

    return {
      success: true,
      message: "Board created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export async function updateBoardAction(
  boardId: string,
  data: Partial<Pick<Board, "name" | "description">>,
) {
  try {
    const updatedBoard = await updateBoard(boardId, data);
    return { success: true, board: updatedBoard };
  } catch (error) {
    console.error("Error updating board:", error);
    return { success: false, error: "Failed to update board" };
  }
}

export async function deleteBoardAction(boardId: string) {
  try {
    const deletedBoard = await deleteBoard(boardId);
    revalidatePath("/onboarding");
    return { success: true, board: deletedBoard };
  } catch (error) {
    console.error("Error deleting board:", error);
    return { success: false, error: "Failed to delete board" };
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
