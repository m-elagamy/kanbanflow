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
    console.log("task is existing");

    return {
      success: false,
      message: `A task with the name "${title}" already exists.`,
      fields: data,
    };
  }

  await createTask(columnId, title, description, priority);

  console.log("Task added!");

  revalidatePath(`/dashboard/[board]`, "page");

  return {
    success: true,
    message: `Task was added successfully.`,
    fields: validatedData.data,
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

  revalidatePath(`/dashboard/[board]`, "page");

  return {
    success: true,
    message: `Task was added successfully.`,
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
