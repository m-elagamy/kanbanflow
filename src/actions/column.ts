"use server";

import { revalidatePath } from "next/cache";
import { Column } from "@prisma/client";
import { createColumn, updateColumn, deleteColumn } from "../lib/dal/column";

export async function createColumnAction(
  _prevState: unknown,
  formData: FormData,
) {
  const boardId = formData.get("boardId") as string;
  const boardTitle = formData.get("boardTitle") as string;
  const columnTitle = formData.get("status") as string;
  await createColumn(boardId, columnTitle);

  revalidatePath(`/dashboard/${boardTitle}`, "page");

  return {
    success: true,
    message: `Column was added successfully.`,
  };
}

export async function updateColumnAction(
  columnId: string,
  boardTitle: string,
  data: Partial<Pick<Column, "title">>,
) {
  try {
    const updatedColumn = await updateColumn(columnId, data);
    return { success: true, column: updatedColumn };
  } catch (error) {
    console.error("Error updating column:", error);
    return { success: false, error: "Failed to update column" };
  } finally {
    revalidatePath(`/dashboard/${boardTitle}`, "page");
  }
}

export async function deleteColumnAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{
  success: boolean;
  message?: string;
}> {
  let boardTitle: string | undefined;
  try {
    const columnId = formData.get("columnId") as string;
    boardTitle = formData.get("boardTitle") as string;
    await deleteColumn(columnId);
    return {
      success: true,
      message: "Column deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting column:", error);
    return { success: false, message: "Failed to delete column" };
  } finally {
    revalidatePath(`/dashboard/${boardTitle}`, "page");
  }
}
