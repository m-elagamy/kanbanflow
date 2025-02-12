"use server";

import { revalidatePath } from "next/cache";
import { taskSchema, type TaskSchema } from "@/schemas/task";
import db from "@/lib/db";
import { ServerActionResult } from "@/lib/types";
import { createTask, updateTask, deleteTask } from "../lib/dal/task";

export const createTaskAction = async (
  _prevState: unknown,
  formData: FormData,
): Promise<ServerActionResult<TaskSchema>> => {
  const data = Object.fromEntries(formData.entries());
  const validatedData = taskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      fields: validatedData.data,
    };
  }

  const { title, description, priority } = validatedData.data;

  const boardSlug = formData.get("boardSlug") as string;
  const columnId = formData.get("columnId") as string;

  const existingTask = await db.task.findUnique({
    where: {
      columnId_title: { columnId, title },
    },
    select: {
      title: true,
    },
  });

  if (existingTask) {
    return {
      success: false,
      message: `A task with the name "${title}" already exists.`,
      fields: { title, description: description ?? "", priority },
    };
  }

  const result = await createTask(columnId, title, description, priority);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to create a task.",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: `Task was added successfully.`,
    fields: { title, description: description ?? "", priority },
  };
};

export async function updateTaskAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ServerActionResult<TaskSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validatedData = taskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      fields: validatedData.data,
    };
  }

  const { title, description, priority } = validatedData.data;
  const boardSlug = formData.get("boardSlug") as string;
  const columnId = formData.get("columnId") as string;
  const taskId = formData.get("taskId") as string;

  const existingTask = await db.task.findUnique({
    where: { id: taskId },
    select: { title: true, description: true, priority: true },
  });

  if (!existingTask) {
    return { success: false, message: "Task not found." };
  }

  const titleChanged = existingTask.title !== title;
  const descriptionChanged = existingTask.description !== description;
  const priorityChanged = existingTask.priority !== priority;

  if (!titleChanged && !descriptionChanged && !priorityChanged) {
    return {
      success: false,
      message:
        "No changes detected. Please update something before submitting.",
      fields: validatedData.data,
    };
  }

  if (titleChanged) {
    const duplicateTask = await db.task.findFirst({
      where: {
        columnId,
        title,
        NOT: { id: taskId },
      },
      select: { title: true },
    });

    if (duplicateTask) {
      return {
        success: false,
        message: `A task with the name "${title}" already exists.`,
        fields: { title, description: description ?? "", priority },
      };
    }
  }

  const updatedTask = await updateTask(taskId, {
    ...(titleChanged && { title }),
    ...(descriptionChanged && { description }),
    ...(priorityChanged && { priority }),
  });

  if (!updatedTask.success) {
    return { success: false, message: "Failed to update the task." };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: "Task updated successfully.",
    fields: { title, description: description ?? "", priority },
  };
}

export async function deleteTaskAction(
  taskId: string,
  boardSlug: string,
): Promise<ServerActionResult<TaskSchema>> {
  const result = await deleteTask(taskId);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to delete the task.",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: "Task was deleted successfully.",
  };
}

export async function updateTaskPositionAction(
  taskId: string,
  oldColumnId: string,
  newColumnId: string,
  newTaskOrder: string[],
  boardSlug?: string,
): Promise<void> {
  if (!taskId || !oldColumnId || !newColumnId || !Array.isArray(newTaskOrder)) {
    throw new Error("updateTaskPositionAction: Invalid parameters provided");
  }

  if (!newTaskOrder.length) {
    throw new Error("updateTaskPositionAction: newTaskOrder is invalid");
  }

  try {
    await db.$transaction(async (tx) => {
      const existingTask = await tx.task.findUnique({
        where: { id: taskId },
        select: { id: true },
      });

      if (!existingTask) {
        throw new Error(`Task ${taskId} not found in the old column`);
      }

      const newColumnTasks = await tx.task.findMany({
        where: { columnId: newColumnId },
        select: { id: true, order: true },
      });

      const currentOrders = new Map(
        newColumnTasks.map((task) => [task.id, task.order]),
      );

      const tasksNeedingUpdate = newTaskOrder
        .map((id, index) => ({
          id,
          newOrder: index,
          currentOrder: currentOrders.get(id),
        }))
        .filter(({ newOrder, currentOrder }) => newOrder !== currentOrder);

      await tx.task.update({
        where: { id: taskId },
        data: {
          columnId: newColumnId,
          order: newTaskOrder.indexOf(taskId),
        },
      });

      for (const { id, newOrder } of tasksNeedingUpdate) {
        await tx.task.update({
          where: { id },
          data: { order: newOrder },
        });
      }
    });
  } catch (error) {
    console.error("Error moving task between columns:", error);
    revalidatePath(`/dashboard/${boardSlug}`, "page");
    throw new Error(
      `Failed to move task: ${error instanceof Error ? error.message : error}`,
    );
  }
}
