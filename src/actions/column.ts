"use server";

import { revalidatePath } from "next/cache";
import { Column } from "@prisma/client";
import { createColumn, updateColumn, deleteColumn } from "../lib/dal/column";
import type { ActionResult } from "@/lib/types";

export async function createColumnAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult<Column>> {
  const boardId = formData.get("boardId") as string;
  const boardTitle = formData.get("boardTitle") as string;
  const columnTitle = formData.get("status") as string;
  const result = await createColumn(boardId, columnTitle);

  if (!result) {
    return {
      success: false,
      message: "Failed to create a column.",
    };
  }

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
): Promise<ActionResult<Column>> {
  const updatedColumn = await updateColumn(columnId, data);

  if (!updatedColumn) {
    return {
      success: false,
      message: "Failed to update column.",
    };
  }

  revalidatePath(`/dashboard/${boardTitle}`, "page");

  return {
    success: true,
    message: "Column updated successfully.",
    data: updatedColumn.data,
  };
}

export async function deleteColumnAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult<Column>> {
  const columnId = formData.get("columnId") as string;
  const boardTitle = formData.get("boardTitle") as string;
  const result = await deleteColumn(columnId);

  if (!result) {
    return {
      success: false,
      message: "Failed to delete column",
    };
  }

  revalidatePath(`/dashboard/${boardTitle}`, "page");

  return {
    success: true,
    message: "Column deleted successfully",
  };
}
