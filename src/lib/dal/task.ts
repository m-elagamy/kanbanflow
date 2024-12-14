import db from "../db";
import { Task } from "@prisma/client";

export const createTask = async (
  columnId: string,
  title: string,
  description?: string,
  order?: number,
): Promise<Task> => {
  const highestOrderTask = await db.task.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
  });

  const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

  return db.task.create({
    data: {
      title,
      description,
      columnId,
      order: order ?? newOrder,
    },
  });
};

export const updateTask = async (
  taskId: string,
  data: Partial<Pick<Task, "title" | "description" | "order" | "columnId">>,
): Promise<Task> => {
  return db.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (taskId: string): Promise<Task> => {
  return db.task.delete({
    where: { id: taskId },
  });
};

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  return db.task.findUnique({
    where: { id: taskId },
  });
};

export const getTasksByColumnId = async (columnId: string): Promise<Task[]> => {
  return db.task.findMany({
    where: { columnId },
    orderBy: { order: "asc" },
  });
};

export const reorderTasks = async (
  columnId: string,
  taskIds: string[],
): Promise<void> => {
  await db.$transaction(
    taskIds.map((id, index) =>
      db.task.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );
};
