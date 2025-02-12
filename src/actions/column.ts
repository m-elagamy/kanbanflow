"use server";

import { revalidatePath } from "next/cache";
import { Column } from "@prisma/client";
import { createColumn, updateColumn, deleteColumn } from "../lib/dal/column";
import type { ServerActionResult } from "@/lib/types";

export async function createColumnAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ServerActionResult<Column>> {
  const boardId = formData.get("boardId") as string;
  const boardSlug = formData.get("boardSlug") as string;
  const columnTitle = formData.get("status") as string;
  const result = await createColumn(boardId, columnTitle);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to create a column.",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: `Column was added successfully.`,
  };
}

export async function updateColumnAction(
  columnId: string,
  boardSlug: string,
  data: Partial<Pick<Column, "title">>,
): Promise<ServerActionResult<Column>> {
  const updatedColumn = await updateColumn(columnId, data);

  if (!updatedColumn) {
    return {
      success: false,
      message: "Failed to update column.",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: "Column updated successfully.",
    fields: updatedColumn.data,
  };
}

export async function deleteColumnAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ServerActionResult<Column>> {
  const columnId = formData.get("columnId") as string;
  const boardSlug = formData.get("boardSlug") as string;
  const result = await deleteColumn(columnId);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to delete column",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: "Column deleted successfully",
  };
}
