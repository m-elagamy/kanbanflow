import { ensureAuthenticated, withUserId } from "@/utils/auth-wrappers";
import db from "../db";
import { Task, type Priority } from "@prisma/client";
import type { TaskSearchResult } from "@/lib/types";

export const createTask = ensureAuthenticated(
  async (
    columnId: string,
    title: string,
    description?: string,
    priority?: Priority,
  ): Promise<Task> => {
    const highestOrderTask = await db.task.findFirst({
      where: { columnId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

    return db.task.create({
      data: {
        title,
        description,
        priority,
        columnId,
        order: newOrder,
      },
    });
  },
);

export const updateTask = ensureAuthenticated(
  async (
    taskId: string,
    data: Omit<Partial<Task>, "id" | "order">,
  ): Promise<Task> => {
    return db.task.update({
      where: { id: taskId },
      data,
    });
  },
);

export const deleteTask = ensureAuthenticated(
  async (taskId: string): Promise<Task> => {
    return db.task.delete({
      where: { id: taskId },
    });
  },
);

export const searchTasks = withUserId(
  async (
    userId: string,
    boardId: string,
    query: string,
  ): Promise<TaskSearchResult[]> => {
    return db.task.findMany({
      where: {
        column: { board: { id: boardId, userId } },
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        columnId: true,
        column: { select: { status: true } },
      },
      orderBy: { order: "asc" },
      take: 20,
    }) as Promise<TaskSearchResult[]>;
  },
);
