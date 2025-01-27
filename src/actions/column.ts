"use server";

import { revalidatePath } from "next/cache";
import { Column } from "@prisma/client";
import { createColumn, updateColumn, deleteColumn } from "../lib/dal/column";

export async function createColumnAction(
  _prevState: unknown,
  formData: FormData,
) {
  const boardId = formData.get("boardId") as string;
  const columnTitle = formData.get("status") as string;
  await createColumn(boardId, columnTitle);

  revalidatePath("/dashboard/[board]", "page");

  return {
    success: true,
    message: `Column was added successfully.`,
    fields: { boardId },
  };
}

export async function updateColumnAction(
  columnId: string,
  data: Partial<Pick<Column, "title">>,
) {
  try {
    const updatedColumn = await updateColumn(columnId, data);
    return { success: true, column: updatedColumn };
  } catch (error) {
    console.error("Error updating column:", error);
    return { success: false, error: "Failed to update column" };
  } finally {
    revalidatePath("/dashboard/[board]", "page");
  }
}

export async function deleteColumnAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  fields?: { columnId: string };
}> {
  try {
    const columnId = formData.get("columnId") as string;
    await deleteColumn(columnId);
    return {
      success: true,
      message: "Column deleted successfully",
      fields: { columnId },
    };
  } catch (error) {
    console.error("Error deleting column:", error);
    return { success: false, error: "Failed to delete column" };
  } finally {
    revalidatePath("/dashboard/[board]", "page");
  }
}
