"use server";

import { revalidatePath } from "next/cache";
import type { Task } from "@prisma/client";
import { taskSchema } from "@/schemas/task";
import db from "@/lib/db";
import { ActionResult } from "@/lib/types";
import { createTask, updateTask, deleteTask } from "../lib/dal/task";

export const createTaskAction = async (
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult<Pick<Task, "title" | "description" | "priority">>> => {
  const data = Object.fromEntries(formData.entries());
  const validatedData = taskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      data: validatedData.data,
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
      data: { title, description: description ?? null, priority },
    };
  }

  const result = await createTask(columnId, title, description, priority);

  if (!result) {
    return {
      success: false,
      message: "Failed to create a task.",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: `Task was added successfully.`,
    data: { title, description: description ?? null, priority },
  };
};

export async function updateTaskAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult<Pick<Task, "title" | "description" | "priority">>> {
  const data = Object.fromEntries(formData.entries());
  const validatedData = taskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      data: validatedData.data,
    };
  }

  const { title, description, priority } = validatedData.data;

  const boardSlug = formData.get("boardSlug") as string;
  const columnId = formData.get("columnId") as string;
  const taskId = formData.get("taskId") as string;

  const existingTask = await db.task.findFirst({
    where: {
      columnId,
      title,
      NOT: { id: taskId },
    },
    select: { title: true },
  });

  if (existingTask) {
    return {
      success: false,
      message: `A task with the name "${title}" already exists.`,
      data: { title, description: description ?? null, priority },
    };
  }

  const result = await updateTask(taskId, {
    columnId,
    title,
    description,
    priority,
  });

  if (!result) {
    return {
      success: false,
      message: "Failed to update the task.",
    };
  }

  revalidatePath(`/dashboard/${boardSlug}`, "page");

  return {
    success: true,
    message: `Task was updated successfully.`,
    data: { title, description: description ?? null, priority },
  };
}

export async function deleteTaskAction(
  taskId: string,
  boardSlug: string,
): Promise<ActionResult<Task>> {
  const result = await deleteTask(taskId);

  if (!result) {
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
