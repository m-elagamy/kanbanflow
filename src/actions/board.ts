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
import { slugify } from "@/app/dashboard/utils/slugify";

export const createBoardAction = async (formData: BoardCreationForm) => {
  try {
    const validatedData = boardSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const name = validatedData.data.title;
    const description = validatedData.data.description;
    const templateId = validatedData.data.template;

    const template = columnsTemplates.find((t) => t.id === templateId);

    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        errors: { _form: ["You must be logged in to create a board"] },
      };
    }

    const boardSlug = slugify(name);

    const board = await db.$transaction(async () => {
      try {
        return await createBoard(
          name,
          user.id,
          boardSlug,
          description,
          template?.columns,
        );
      } catch (dbError) {
        console.error("Database creation error:", dbError);
        throw new Error("Failed to create board");
      }
    });

    return {
      success: true,
      message: "Board created successfully",
      boardId: board.id,
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
