"use server";

import {
  taskSchema,
  taskPageSchema,
  taskSearchSchema,
  taskPositionSchema,
  type TaskSchema,
} from "@/schemas/task";
import {
  ServerActionResult,
  type TaskPage,
  type TaskSearchPage,
  type TaskSummary,
} from "@/lib/types";
import {
  createTask,
  updateTask,
  deleteTask,
  getColumnTasksPage,
  searchTasks,
  getTaskForRename,
  updateTaskPosition,
} from "@/lib/dal/task";
import handlePrismaError from "@/utils/prisma-error-handler";
import { revalidateUserBoards } from "@/utils/revalidate-user-boards";
import { TASKS_PAGE_SIZE } from "@/lib/constants";

export const createTaskAction = async (
  formData: FormData,
): Promise<ServerActionResult<Partial<TaskSummary>>> => {
  const data = Object.fromEntries(formData.entries());
  const validatedData = taskSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid input",
      fields: validatedData.data,
    };
  }

  const {
    title,
    description,
    priority = "medium",
    dueDate,
  } = validatedData.data;

  const columnId = formData.get("columnId") as string;

  const result = await createTask(
    columnId,
    title,
    description,
    priority,
    dueDate ? new Date(dueDate) : null,
  );

  if (!result.success || !result.data) {
    return {
      success: false,
      message: "Failed to create a task.",
    };
  }

  await revalidateUserBoards();

  return {
    success: true,
    message: `Task was added successfully.`,
    fields: {
      id: result.data.id,
      title,
      description: description ?? "",
      priority,
      order: result.data.order,
    },
  };
};

export async function updateTaskAction(
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

  const { title, description, priority, dueDate } = validatedData.data;
  const taskId = formData.get("taskId") as string;

  const existingTask = await getTaskForRename(taskId);

  if (!existingTask.success || !existingTask.data) {
    return { success: false, message: "Task not found." };
  }

  const existingDueDate = existingTask.data.dueDate
    ? existingTask.data.dueDate.toISOString().slice(0, 10)
    : null;

  const titleChanged = existingTask.data.title !== title;
  const descriptionChanged = existingTask.data.description !== description;
  const priorityChanged = existingTask.data.priority !== priority;
  const dueDateChanged = existingDueDate !== dueDate;

  if (
    !titleChanged &&
    !descriptionChanged &&
    !priorityChanged &&
    !dueDateChanged
  ) {
    return {
      success: false,
      message:
        "No changes detected. Please update something before submitting.",
      fields: validatedData.data,
    };
  }

  const updatedTask = await updateTask(taskId, {
    ...(titleChanged && { title }),
    ...(descriptionChanged && { description }),
    ...(priorityChanged && { priority }),
    ...(dueDateChanged && { dueDate: dueDate ? new Date(dueDate) : null }),
  });

  if (!updatedTask.success) {
    return { success: false, message: "Failed to update the task." };
  }

  if (priorityChanged) {
    await revalidateUserBoards();
  }

  return {
    success: true,
    message: "Task updated successfully.",
    fields: { title, description: description ?? "", priority, dueDate },
  };
}

export async function deleteTaskAction(
  taskId: string,
): Promise<ServerActionResult<TaskSchema>> {
  const result = await deleteTask(taskId);

  if (!result.success) {
    return {
      success: false,
      message: "Failed to delete the task.",
    };
  }

  await revalidateUserBoards();

  return {
    success: true,
    message: "Task was deleted successfully.",
  };
}

export async function searchTasksAction(
  boardId: string,
  query: string,
  cursor: string | null = null,
  limit = 20,
): Promise<ServerActionResult<TaskSearchPage>> {
  const validated = taskSearchSchema.safeParse({
    boardId,
    query,
    cursor,
    limit,
  });
  if (!validated.success) {
    return { success: false, message: "Invalid search parameters." };
  }

  const result = await searchTasks(
    validated.data.boardId,
    validated.data.query,
    validated.data.cursor,
    validated.data.limit,
  );

  if (!result.success || !result.data) {
    return { success: false, message: "Search failed. Please try again." };
  }

  return { success: true, message: "", fields: result.data };
}

export async function getColumnTasksPageAction(
  columnId: string,
  cursor: string | null = null,
  limit = TASKS_PAGE_SIZE,
): Promise<ServerActionResult<TaskPage>> {
  const validated = taskPageSchema.safeParse({ columnId, cursor, limit });
  if (!validated.success) {
    return { success: false, message: "Invalid pagination parameters." };
  }

  const result = await getColumnTasksPage(
    validated.data.columnId,
    validated.data.cursor,
    validated.data.limit,
  );
  if (!result.success || !result.data) {
    return { success: false, message: "Failed to load tasks." };
  }

  return { success: true, message: "", fields: result.data };
}

export async function updateTaskPositionAction(
  taskId: string,
  newColumnId: string,
  previousTaskId: string | null,
  nextTaskId: string | null,
): Promise<ServerActionResult<{ columnId: string; order: string }>> {
  const validatedData = taskPositionSchema.safeParse({
    taskId,
    newColumnId,
    previousTaskId,
    nextTaskId,
  });

  if (!validatedData.success) {
    return { success: false, message: "Invalid parameters provided." };
  }

  try {
    const result = await updateTaskPosition(
      validatedData.data.taskId,
      validatedData.data.newColumnId,
      validatedData.data.previousTaskId,
      validatedData.data.nextTaskId,
    );

    if (!result.success) {
      return { success: false, message: "Failed to move task." };
    }

    return {
      success: true,
      message: "Task moved successfully.",
      fields: result.data,
    };
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  }
}
