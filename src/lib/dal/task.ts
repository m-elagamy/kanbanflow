import { withOwnership, withUserId } from "@/utils/auth-wrappers";
import db from "../db";
import { Task, type Priority } from "@prisma/client";
import type { TaskSearchResult } from "@/lib/types";

const resolveColumnOwnerId = async (columnId: string) => {
  const column = await db.column.findUnique({
    where: { id: columnId },
    select: { board: { select: { userId: true } } },
  });
  return column?.board.userId;
};

const resolveTaskOwnerId = async (taskId: string) => {
  const task = await db.task.findUnique({
    where: { id: taskId },
    select: { column: { select: { board: { select: { userId: true } } } } },
  });
  return task?.column.board.userId;
};

export const createTask = withOwnership(
  async (
    userId: string,
    columnId: string,
    title: string,
    description?: string,
    priority?: Priority,
    dueDate?: Date | null,
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
        dueDate,
      },
    });
  },
  resolveColumnOwnerId,
);

export const updateTask = withOwnership(
  async (
    userId: string,
    taskId: string,
    data: Omit<Partial<Task>, "id" | "order">,
  ): Promise<Task> => {
    return db.task.update({
      where: { id: taskId },
      data,
    });
  },
  resolveTaskOwnerId,
);

export const deleteTask = withOwnership(
  async (userId: string, taskId: string): Promise<Task> => {
    return db.task.delete({
      where: { id: taskId },
    });
  },
  resolveTaskOwnerId,
);

export const findTaskByColumnAndTitle = withOwnership(
  async (userId: string, columnId: string, title: string) => {
    return db.task.findUnique({
      where: { columnId_title: { columnId, title } },
      select: { title: true },
    });
  },
  resolveColumnOwnerId,
);

export const getTaskForRename = withOwnership(
  async (userId: string, taskId: string) => {
    return db.task.findUnique({
      where: { id: taskId },
      select: {
        title: true,
        description: true,
        priority: true,
        dueDate: true,
      },
    });
  },
  resolveTaskOwnerId,
);

export const findDuplicateTaskTitle = withOwnership(
  async (
    userId: string,
    columnId: string,
    title: string,
    excludeTaskId: string,
  ) => {
    return db.task.findFirst({
      where: { columnId, title, NOT: { id: excludeTaskId } },
      select: { title: true },
    });
  },
  resolveColumnOwnerId,
);

export const updateTaskPosition = withOwnership(
  async (
    userId: string,
    taskId: string,
    _oldColumnId: string,
    newColumnId: string,
    newTaskOrder: string[],
  ): Promise<void> => {
    const newColumnOwnerId = await resolveColumnOwnerId(newColumnId);
    if (newColumnOwnerId !== userId) {
      throw new Error("Target column not found.");
    }

    await db.$transaction(async (tx) => {
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
  },
  resolveTaskOwnerId,
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
