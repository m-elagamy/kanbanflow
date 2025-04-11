import { ensureAuthenticated } from "@/utils/auth-wrappers";
import db from "../db";
import { Task, type Priority } from "@prisma/client";

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
