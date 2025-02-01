"use server";

import { addTaskSchema } from "@/schemas/task";
import { createTask, updateTask, deleteTask } from "../lib/dal/task";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export const createTaskAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries());
  const validatedData = addTaskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      errors: validatedData.error.format(),
      fields: data,
    };
  }

  const { title, description, priority } = validatedData.data;
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
      fields: data,
    };
  }

  await createTask(columnId, title, description, priority);

  return {
    success: true,
    message: `Task was added successfully.`,
    fields: { title, description, priority },
  };
};

export async function updateTaskAction(
  _prevState: unknown,
  formData: FormData,
) {
  const data = Object.fromEntries(formData.entries());
  const validatedData = addTaskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      errors: validatedData.error.format(),
      fields: data,
    };
  }

  const { title, description, priority } = validatedData.data;
  const columnId = formData.get("columnId") as string;
  const taskId = formData.get("taskId") as string;

  const currentTask = await db.task.findUnique({
    where: { id: taskId },
    select: { title: true },
  });

  if (currentTask?.title !== title) {
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
        fields: data,
      };
    }
  }

  await updateTask(taskId, {
    columnId,
    title,
    description,
    priority,
  });

  return {
    success: true,
    message: `Task was updated successfully.`,
    fields: validatedData.data,
  };
}

export async function deleteTaskAction(taskId: string) {
  try {
    const deletedTask = await deleteTask(taskId);
    return { success: true, task: deletedTask };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  } finally {
    revalidatePath(`/dashboard/[board]`, "page");
  }
}

export async function updateTaskPositionAction(
  taskId: string,
  oldColumnId: string,
  newColumnId: string,
  newTaskOrder: string[],
): Promise<void> {
  if (!taskId || !oldColumnId || !newColumnId || !Array.isArray(newTaskOrder)) {
    throw new Error("Invalid parameters provided");
  }

  if (!newTaskOrder.length) {
    throw new Error("moveTaskBetweenColumnsAction: newTaskOrder is invalid");
  }

  try {
    await db.$transaction(async (tx) => {
      // Check if the task exists in the old column
      const existingTask = await tx.task.findUnique({
        where: { id: taskId },
        select: { id: true },
      });

      if (!existingTask) {
        throw new Error("Task not found in the specified column");
      }

      // Fetch existing tasks in the new column
      const existingOrders = await tx.task.findMany({
        where: { columnId: newColumnId },
        select: { id: true, order: true },
      });

      // Create a map of current orders
      const currentOrders = new Map(
        existingOrders.map((task) => [task.id, task.order]),
      );

      // Filter only tasks that need updating
      const updates = newTaskOrder
        .map((id, index) => ({
          id,
          newOrder: index,
          currentOrder: currentOrders.get(id),
        }))
        .filter(({ newOrder, currentOrder }) => newOrder !== currentOrder);

      // Move task and update orders in a single transaction
      await Promise.all([
        tx.task.update({
          where: { id: taskId },
          data: {
            columnId: newColumnId,
            order: newTaskOrder.indexOf(taskId),
          },
        }),
        ...updates.map(({ id, newOrder }) =>
          tx.task.update({
            where: { id },
            data: { order: newOrder },
          }),
        ),
      ]);
    });
  } catch (error) {
    console.error("Error moving task between columns:", error);
    throw new Error("Failed to move task between columns");
  }
}
