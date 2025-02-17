"use server";

import { Column } from "@prisma/client";
import { createColumn, updateColumn, deleteColumn } from "../lib/dal/column";
import type { ServerActionResult } from "@/lib/types";
import type { ColumnStatus } from "@/schemas/column";

export async function createColumnAction(
  boardId: string,
  columnStatus: ColumnStatus,
): Promise<ServerActionResult<Column>> {
  const createdColumn = await createColumn(boardId, columnStatus);

  if (!createdColumn.success) {
    return {
      success: false,
      message: "Failed to create a column.",
    };
  }

  return {
    success: true,
    message: `Column was added successfully.`,
    fields: createdColumn.data,
  };
}

export async function updateColumnAction(
  columnId: string,
  data: Partial<Pick<Column, "status">>,
): Promise<ServerActionResult<Column>> {
  const updatedColumn = await updateColumn(columnId, data);

  if (!updatedColumn) {
    return {
      success: false,
      message: "Failed to update column.",
    };
  }

  return {
    success: true,
    message: "Column updated successfully.",
    fields: updatedColumn.data,
  };
}

export async function deleteColumnAction(
  columnId: string,
): Promise<ServerActionResult<Column>> {
  const result = await deleteColumn(columnId);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to delete column",
    };
  }

  return {
    success: true,
    message: "Column deleted successfully",
  };
}
