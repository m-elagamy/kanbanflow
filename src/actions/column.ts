"use server";

import { Column } from "@prisma/client";
import {
  createColumn,
  updateColumn,
  deleteColumn,
  updateColumnPosition,
} from "@/lib/dal/column";
import columnStatusSchema, {
  columnPositionSchema,
  type ColumnStatus,
} from "@/schemas/column";
import type { ServerActionResult } from "@/lib/types";
import handlePrismaError from "@/utils/prisma-error-handler";
import { revalidateUserBoards } from "@/utils/revalidate-user-boards";

export async function createColumnAction(
  boardId: string,
  columnStatus: ColumnStatus,
): Promise<ServerActionResult<Column>> {
  const validatedData = columnStatusSchema.safeParse({ status: columnStatus });

  if (!validatedData.success) {
    return { success: false, message: "Invalid column status." };
  }

  try {
    const createdColumn = await createColumn(
      boardId,
      validatedData.data.status,
    );

    if (!createdColumn.success || !createdColumn.data) {
      return {
        success: false,
        message: "Failed to create a column.",
      };
    }

    await revalidateUserBoards();

    return {
      success: true,
      message: `Column was added successfully.`,
      fields: createdColumn.data,
    };
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  }
}

export async function updateColumnAction(
  columnId: string,
  data: Partial<Pick<Column, "status">>,
): Promise<ServerActionResult<Column>> {
  const validatedData = columnStatusSchema.partial().safeParse(data);

  if (!validatedData.success) {
    return { success: false, message: "Invalid column status." };
  }

  try {
    const updatedColumn = await updateColumn(columnId, validatedData.data);

    if (!updatedColumn.success || !updatedColumn.data) {
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
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  }
}

export async function deleteColumnAction(
  columnId: string,
): Promise<ServerActionResult<Column>> {
  try {
    const result = await deleteColumn(columnId);

    if (!result.success) {
      return {
        success: false,
        message: "Failed to delete column",
      };
    }

    await revalidateUserBoards();

    return {
      success: true,
      message: "Column deleted successfully",
    };
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  }
}

export async function updateColumnPositionAction(
  boardId: string,
  newColumnOrder: string[],
): Promise<ServerActionResult<null>> {
  const validatedData = columnPositionSchema.safeParse({
    boardId,
    newColumnOrder,
  });

  if (!validatedData.success) {
    return { success: false, message: "Invalid parameters provided." };
  }

  try {
    const result = await updateColumnPosition(
      validatedData.data.boardId,
      validatedData.data.newColumnOrder,
    );

    if (!result.success) {
      return { success: false, message: "Failed to reorder columns." };
    }

    return { success: true, message: "Columns reordered successfully." };
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  }
}
