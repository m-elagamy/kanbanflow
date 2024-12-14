"use server";

import {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasksByColumnId,
  reorderTasks,
} from "../lib/dal/task";
import { Task } from "@prisma/client";

export async function createTaskAction(
  columnId: string,
  title: string,
  description?: string,
  order?: number,
) {
  try {
    const task = await createTask(columnId, title, description, order);
    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(
  taskId: string,
  data: Partial<Pick<Task, "title" | "description" | "order" | "columnId">>,
) {
  try {
    const updatedTask = await updateTask(taskId, data);
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    const deletedTask = await deleteTask(taskId);
    return { success: true, task: deletedTask };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function getTaskByIdAction(taskId: string) {
  try {
    const task = await getTaskById(taskId);
    return { success: true, task };
  } catch (error) {
    console.error("Error getting task:", error);
    return { success: false, error: "Failed to get task" };
  }
}

export async function getTasksByColumnIdAction(columnId: string) {
  try {
    const tasks = await getTasksByColumnId(columnId);
    return { success: true, tasks };
  } catch (error) {
    console.error("Error getting tasks:", error);
    return { success: false, error: "Failed to get tasks" };
  }
}

export async function reorderTasksAction(columnId: string, taskIds: string[]) {
  try {
    await reorderTasks(columnId, taskIds);
    return { success: true };
  } catch (error) {
    console.error("Error reordering tasks:", error);
    return { success: false, error: "Failed to reorder tasks" };
  }
}
