"use server";

import {
  createColumn,
  updateColumn,
  deleteColumn,
  getColumnById,
  getColumnsByBoardId,
} from "../lib/dal/column";
import { Column } from "@prisma/client";

export async function createColumnAction(boardId: string, name: string) {
  try {
    const column = await createColumn(boardId, name);
    return { success: true, column };
  } catch (error) {
    console.error("Error creating column:", error);
    return { success: false, error: "Failed to create column" };
  }
}

export async function updateColumnAction(
  columnId: string,
  data: Partial<Pick<Column, "name">>,
) {
  try {
    const updatedColumn = await updateColumn(columnId, data);
    return { success: true, column: updatedColumn };
  } catch (error) {
    console.error("Error updating column:", error);
    return { success: false, error: "Failed to update column" };
  }
}

export async function deleteColumnAction(columnId: string) {
  try {
    await deleteColumn(columnId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting column:", error);
    return { success: false, error: "Failed to delete column" };
  }
}

export async function getColumnByIdAction(columnId: string) {
  try {
    const column = await getColumnById(columnId);
    return { success: true, column };
  } catch (error) {
    console.error("Error getting column:", error);
    return { success: false, error: "Failed to get column" };
  }
}

export async function getColumnsByBoardIdAction(boardId: string) {
  try {
    const columns = await getColumnsByBoardId(boardId);
    return { success: true, columns };
  } catch (error) {
    console.error("Error getting columns:", error);
    return { success: false, error: "Failed to get columns" };
  }
}
