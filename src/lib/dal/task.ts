import { withOwnership, withUserId } from "@/utils/auth-wrappers";
import db from "../db";
import { Task, type Prisma, type Priority } from "@prisma/client";
import type {
  DashboardFocusPreview,
  DashboardFocusTask,
  TaskPage,
  TaskSearchPage,
  TasksFilter,
  WorkspaceTasksPage,
} from "@/lib/types";
import { generateKeyBetween } from "fractional-indexing";
import {
  DASHBOARD_FOCUS_PREVIEW_SIZE,
  TERMINAL_COLUMN_STATUSES,
} from "@/lib/constants";
import { getStartOfTodayUtc } from "@/utils/due-date-boundary";

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

export const getTaskDetails = withOwnership(
  async (userId: string, taskId: string) => {
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        order: true,
        columnId: true,
        dueDate: true,
        column: { select: { board: { select: { slug: true } } } },
      },
    });

    if (!task) return null;

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      order: task.order,
      columnId: task.columnId,
      dueDate: task.dueDate?.toISOString() ?? null,
      boardSlug: task.column.board.slug,
    };
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

export const getTasksPage = withUserId(
  async (
    userId: string,
    boardId: string | null,
    query: string,
    cursor: string | null,
    limit: number,
  ): Promise<TaskSearchPage> => {
    const normalizedQuery = query.trim();
    const tasks = await db.task.findMany({
      where: {
        column: {
          board: {
            userId,
            ...(boardId && { id: boardId }),
          },
        },
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
        column: {
          select: {
            status: true,
            board: { select: { title: true, slug: true } },
          },
        },
      },
      orderBy: [{ column: { order: "asc" } }, { order: "asc" }, { id: "asc" }],
    });

    const hasMore = tasks.length > limit;
    const page = hasMore ? tasks.slice(0, limit) : tasks;

    return {
      items: page.map((task) => ({
        ...task,
        board: task.column.board,
        column: { status: task.column.status },
        dueDate: task.dueDate?.toISOString() ?? null,
      })),
      nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
    };
  },
);

const workspaceTaskSelect = {
  id: true,
  title: true,
  description: true,
  priority: true,
  order: true,
  columnId: true,
  dueDate: true,
  column: {
    select: {
      status: true,
      board: { select: { title: true, slug: true } },
    },
  },
} satisfies Prisma.TaskSelect;

const toWorkspaceTask = <
  T extends {
    dueDate: Date | null;
    priority: Priority;
    column: { status: string; board: { title: string; slug: string } };
  },
>(
  task: T,
  startOfToday: Date,
) => ({
  ...task,
  board: task.column.board,
  column: { status: task.column.status },
  dueDate: task.dueDate?.toISOString() ?? null,
  attentionReason:
    task.dueDate && task.dueDate < startOfToday
      ? ("overdue" as const)
      : task.priority === "high"
        ? ("high-priority" as const)
        : null,
});

export const getDashboardFocusTasks = withUserId(
  async (userId: string): Promise<DashboardFocusPreview> => {
    const startOfToday = getStartOfTodayUtc();
    const tasks = await db.task.findMany({
      where: {
        OR: [{ dueDate: { lt: startOfToday } }, { priority: "high" }],
        column: {
          status: { notIn: TERMINAL_COLUMN_STATUSES },
          board: { userId },
        },
      },
      orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { id: "asc" }],
      take: DASHBOARD_FOCUS_PREVIEW_SIZE + 1,
      select: workspaceTaskSelect,
    });

    return {
      items: tasks
        .slice(0, DASHBOARD_FOCUS_PREVIEW_SIZE)
        .map(
          (task) => toWorkspaceTask(task, startOfToday) as DashboardFocusTask,
        ),
      hasMore: tasks.length > DASHBOARD_FOCUS_PREVIEW_SIZE,
    };
  },
);

export const getWorkspaceTasksOverviewPage = withUserId(
  async (
    userId: string,
    filter: TasksFilter,
    page: number,
    limit: number,
  ): Promise<WorkspaceTasksPage> => {
    const startOfToday = getStartOfTodayUtc();
    const activeColumn = { status: { notIn: TERMINAL_COLUMN_STATUSES } };
    const filterWhere: Prisma.TaskWhereInput =
      filter === "needs-attention"
        ? {
            OR: [{ dueDate: { lt: startOfToday } }, { priority: "high" }],
            column: activeColumn,
          }
        : filter === "overdue"
          ? { dueDate: { lt: startOfToday }, column: activeColumn }
          : filter === "high-priority"
            ? { priority: "high", column: activeColumn }
            : {};
    const where: Prisma.TaskWhereInput = {
      AND: [{ column: { board: { userId } } }, filterWhere],
    };
    const orderBy: Prisma.TaskOrderByWithRelationInput[] =
      filter === "all"
        ? [
            { column: { board: { order: "asc" } } },
            { column: { order: "asc" } },
            { order: "asc" },
            { id: "asc" },
          ]
        : [{ dueDate: { sort: "asc", nulls: "last" } }, { id: "asc" }];

    const [tasks, totalCount] = await Promise.all([
      db.task.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: workspaceTaskSelect,
      }),
      db.task.count({ where }),
    ]);

    return {
      items: tasks.map((task) => toWorkspaceTask(task, startOfToday)),
      totalCount,
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
