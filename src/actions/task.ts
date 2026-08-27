"use server";

import { taskSchema, taskPositionSchema, type TaskSchema } from "@/schemas/task";
import {
  ServerActionResult,
  type TaskSummary,
  type TaskSearchResult,
} from "@/lib/types";
import {
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  findTaskByColumnAndTitle,
  getTaskForRename,
  findDuplicateTaskTitle,
  updateTaskPosition,
} from "@/lib/dal/task";
import handlePrismaError from "@/utils/prisma-error-handler";

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

  const { title, description, priority = "medium" } = validatedData.data;

  const columnId = formData.get("columnId") as string;

  const existingTask = await findTaskByColumnAndTitle(columnId, title);

  if (!existingTask.success) {
    return { success: false, message: "Column not found." };
  }

  if (existingTask.data) {
    return {
      success: false,
      message: `A task with the name "${title}" already exists.`,
      fields: { title, description: description ?? "", priority },
    };
  }

  const result = await createTask(columnId, title, description, priority);

  if (!result.success || !result.data) {
    return {
      success: false,
      message: "Failed to create a task.",
    };
  }

  return {
    success: true,
    message: `Task was added successfully.`,
    fields: {
      id: result.data.id,
      title,
      description: description ?? "",
      priority,
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

  const { title, description, priority } = validatedData.data;
  const columnId = formData.get("columnId") as string;
  const taskId = formData.get("taskId") as string;

  const existingTask = await getTaskForRename(taskId);

  if (!existingTask.success || !existingTask.data) {
    return { success: false, message: "Task not found." };
  }

  const titleChanged = existingTask.data.title !== title;
  const descriptionChanged = existingTask.data.description !== description;
  const priorityChanged = existingTask.data.priority !== priority;

  if (!titleChanged && !descriptionChanged && !priorityChanged) {
    return {
      success: false,
      message:
        "No changes detected. Please update something before submitting.",
      fields: validatedData.data,
    };
  }

  if (titleChanged) {
    const duplicateTask = await findDuplicateTaskTitle(
      columnId,
      title,
      taskId,
    );

    if (!duplicateTask.success) {
      return { success: false, message: "Column not found." };
    }

    if (duplicateTask.data) {
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

  return {
    success: true,
    message: "Task updated successfully.",
    fields: { title, description: description ?? "", priority },
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

  return {
    success: true,
    message: "Task was deleted successfully.",
  };
}

export async function searchTasksAction(
  boardId: string,
  query: string,
): Promise<ServerActionResult<TaskSearchResult[]>> {
  if (!query.trim()) return { success: true, message: "", fields: [] };

  const result = await searchTasks(boardId, query.trim());

  if (!result.success) {
    return { success: false, message: "Search failed." };
  }

  return { success: true, message: "", fields: result.data ?? [] };
}

export async function updateTaskPositionAction(
  taskId: string,
  oldColumnId: string,
  newColumnId: string,
  newTaskOrder: string[],
): Promise<ServerActionResult<null>> {
  const validatedData = taskPositionSchema.safeParse({
    taskId,
    oldColumnId,
    newColumnId,
    newTaskOrder,
  });

  if (!validatedData.success) {
    return { success: false, message: "Invalid parameters provided." };
  }

  try {
    const result = await updateTaskPosition(
      validatedData.data.taskId,
      validatedData.data.oldColumnId,
      validatedData.data.newColumnId,
      validatedData.data.newTaskOrder,
    );

    if (!result.success) {
      return { success: false, message: "Failed to move task." };
    }

    return { success: true, message: "Task moved successfully." };
  } catch (error) {
    return { success: false, message: handlePrismaError(error) };
  }
}
