import { withOwnership, withUserId } from "@/utils/auth-wrappers";
import db from "../db";
import { Task, type Priority } from "@prisma/client";
import type { TaskPage, TaskSearchPage } from "@/lib/types";
import { generateKeyBetween } from "fractional-indexing";

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

    const newOrder = generateKeyBetween(highestOrderTask?.order ?? null, null);

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

export const updateTaskPosition = withOwnership(
  async (
    userId: string,
    taskId: string,
    newColumnId: string,
    previousTaskId: string | null,
    nextTaskId: string | null,
  ): Promise<Pick<Task, "columnId" | "order">> => {
    if (previousTaskId === taskId || nextTaskId === taskId) {
      throw new Error("Invalid task position.");
    }

    const [sourceTask, targetColumn] = await Promise.all([
      db.task.findUnique({
        where: { id: taskId },
        select: { column: { select: { boardId: true } } },
      }),
      db.column.findUnique({
        where: { id: newColumnId },
        select: { boardId: true, board: { select: { userId: true } } },
      }),
    ]);

    if (
      !sourceTask ||
      !targetColumn ||
      targetColumn.board.userId !== userId ||
      sourceTask.column.boardId !== targetColumn.boardId
    ) {
      throw new Error("Target column not found.");
    }

    return db.$transaction(async (tx) => {
      const anchorIds = [previousTaskId, nextTaskId].filter(
        (id): id is string => Boolean(id),
      );
      const anchors = await tx.task.findMany({
        where: { id: { in: anchorIds }, columnId: newColumnId },
        select: { id: true, order: true },
      });
      const anchorOrders = new Map(
        anchors.map((task) => [task.id, task.order]),
      );

      if (
        (previousTaskId && !anchorOrders.has(previousTaskId)) ||
        (nextTaskId && !anchorOrders.has(nextTaskId))
      ) {
        throw new Error("Task position is out of date. Please try again.");
      }

      let previousOrder = previousTaskId
        ? anchorOrders.get(previousTaskId)!
        : null;
      const nextOrder = nextTaskId ? anchorOrders.get(nextTaskId)! : null;

      if (!previousTaskId && !nextTaskId) {
        const lastTask = await tx.task.findFirst({
          where: { columnId: newColumnId, id: { not: taskId } },
          orderBy: { order: "desc" },
          select: { order: true },
        });
        previousOrder = lastTask?.order ?? null;
      }

      const followingTask =
        previousOrder && !nextOrder
          ? await tx.task.findFirst({
              where: {
                columnId: newColumnId,
                id: { not: taskId },
                order: { gt: previousOrder },
              },
              orderBy: { order: "asc" },
              select: { order: true },
            })
          : null;
      const resolvedNextOrder = nextOrder ?? followingTask?.order ?? null;

      if (
        previousOrder &&
        resolvedNextOrder &&
        previousOrder >= resolvedNextOrder
      ) {
        throw new Error("Invalid task position.");
      }

      const order = generateKeyBetween(previousOrder, resolvedNextOrder);

      return tx.task.update({
        where: { id: taskId },
        data: { columnId: newColumnId, order },
        select: {
          columnId: true,
          order: true,
        },
      });
    });
  },
  resolveTaskOwnerId,
);

export const searchTasks = withUserId(
  async (
    userId: string,
    boardId: string,
    query: string,
    cursor: string | null,
    limit: number,
  ): Promise<TaskSearchPage> => {
    const normalizedQuery = query.trim();
    const tasks = await db.task.findMany({
      where: {
        column: { board: { id: boardId, userId } },
        ...(normalizedQuery && {
          OR: [
            { title: { contains: normalizedQuery, mode: "insensitive" } },
            {
              description: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: limit + 1,
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        order: true,
        columnId: true,
        dueDate: true,
        column: { select: { status: true } },
      },
      orderBy: [{ column: { order: "asc" } }, { order: "asc" }, { id: "asc" }],
    });

    const hasMore = tasks.length > limit;
    const page = hasMore ? tasks.slice(0, limit) : tasks;

    return {
      items: page.map((task) => ({
        ...task,
        dueDate: task.dueDate?.toISOString() ?? null,
      })),
      nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
    };
  },
);

export const getColumnTasksPage = withOwnership(
  async (
    _userId: string,
    columnId: string,
    cursor: string | null,
    limit: number,
    priority: Priority | null,
  ): Promise<TaskPage> => {
    const tasks = await db.task.findMany({
      where: {
        columnId,
        ...(priority && { priority }),
        ...(cursor && { order: { gt: cursor } }),
      },
      take: limit + 1,
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        order: true,
        columnId: true,
        dueDate: true,
      },
    });

    const hasMore = tasks.length > limit;
    const page = hasMore ? tasks.slice(0, limit) : tasks;

    return {
      items: page.map((task) => ({
        ...task,
        dueDate: task.dueDate?.toISOString() ?? null,
      })),
      nextCursor: hasMore ? (page.at(-1)?.order ?? null) : null,
    };
  },
  resolveColumnOwnerId,
);
