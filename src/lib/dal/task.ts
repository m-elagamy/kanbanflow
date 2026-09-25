import { withUserId } from "@/utils/auth-wrappers";
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
  STALE_TASK_DAYS,
  TERMINAL_COLUMN_STATUSES,
} from "@/lib/constants";

const getStaleTaskBoundary = (now = new Date()) =>
  new Date(now.getTime() - STALE_TASK_DAYS * 24 * 60 * 60 * 1000);

export const createTask = withUserId(
  async (
    userId: string,
    columnId: string,
    title: string,
    description?: string,
    priority?: Priority,
  ): Promise<Task> => {
    const column = await db.column.findFirst({
      where: { id: columnId, board: { userId } },
      select: { id: true },
    });
    if (!column) throw new Error("Column not found.");

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
      },
    });
  },
);

export const updateTask = withUserId(
  async (
    userId: string,
    taskId: string,
    data: Omit<Partial<Task>, "id" | "order">,
  ): Promise<Task> => {
    const existing = await db.task.findFirst({
      where: { id: taskId, column: { board: { userId } } },
      select: { id: true },
    });
    if (!existing) throw new Error("Task not found.");

    return db.task.update({
      where: { id: taskId },
      data,
    });
  },
);

export const deleteTask = withUserId(async (userId: string, taskId: string) => {
  const result = await db.task.deleteMany({
    where: { id: taskId, column: { board: { userId } } },
  });
  if (result.count === 0) return null;
  return { id: taskId };
});

export const getTaskForRename = withUserId(
  async (userId: string, taskId: string) => {
    return db.task.findFirst({
      where: { id: taskId, column: { board: { userId } } },
      select: {
        title: true,
        description: true,
        priority: true,
      },
    });
  },
);

export const getTaskDetails = withUserId(
  async (userId: string, taskId: string) => {
    const task = await db.task.findFirst({
      where: { id: taskId, column: { board: { userId } } },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        order: true,
        columnId: true,
        columnEnteredAt: true,
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
      columnEnteredAt: task.columnEnteredAt.toISOString(),
      boardSlug: task.column.board.slug,
    };
  },
);

export const updateTaskPosition = withUserId(
  async (
    userId: string,
    taskId: string,
    newColumnId: string,
    previousTaskId: string | null,
    nextTaskId: string | null,
  ): Promise<
    Pick<Task, "columnId" | "order" | "columnEnteredAt"> & {
      movedBetweenColumns: boolean;
    }
  > => {
    if (previousTaskId === taskId || nextTaskId === taskId) {
      throw new Error("Invalid task position.");
    }

    const [sourceTask, targetColumn] = await Promise.all([
      db.task.findUnique({
        where: { id: taskId },
        select: { columnId: true, column: { select: { boardId: true } } },
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

      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          columnId: newColumnId,
          order,
          ...(sourceTask.columnId !== newColumnId && {
            columnEnteredAt: new Date(),
          }),
        },
        select: {
          columnId: true,
          order: true,
          columnEnteredAt: true,
        },
      });

      return {
        ...updatedTask,
        movedBetweenColumns: sourceTask.columnId !== newColumnId,
      };
    });
  },
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
        columnEnteredAt: true,
        column: {
          select: {
            status: true,
            board: { select: { id: true, title: true, slug: true } },
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
        columnEnteredAt: task.columnEnteredAt.toISOString(),
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
  columnEnteredAt: true,
  column: {
    select: {
      status: true,
            board: { select: { id: true, title: true, slug: true } },
    },
  },
} satisfies Prisma.TaskSelect;

const toWorkspaceTask = <
  T extends {
    columnEnteredAt: Date;
    priority: Priority;
      column: {
        status: string;
        board: { id: string; title: string; slug: string };
      };
  },
>(
  task: T,
  staleBoundary: Date,
) => ({
  ...task,
  board: task.column.board,
  column: { status: task.column.status },
  columnEnteredAt: task.columnEnteredAt.toISOString(),
  attentionReason:
    task.columnEnteredAt <= staleBoundary
      ? ("stale" as const)
      : task.priority === "high"
        ? ("high-priority" as const)
        : null,
});

export const getDashboardFocusTasks = withUserId(
  async (userId: string): Promise<DashboardFocusPreview> => {
    const staleBoundary = getStaleTaskBoundary();
    const tasks = await db.task.findMany({
      where: {
        OR: [{ columnEnteredAt: { lte: staleBoundary } }, { priority: "high" }],
        column: {
          status: { notIn: TERMINAL_COLUMN_STATUSES },
          board: { userId },
        },
      },
      orderBy: [{ columnEnteredAt: "asc" }, { id: "asc" }],
      take: DASHBOARD_FOCUS_PREVIEW_SIZE + 1,
      select: workspaceTaskSelect,
    });

    return {
      items: tasks
        .slice(0, DASHBOARD_FOCUS_PREVIEW_SIZE)
        .map(
          (task) => toWorkspaceTask(task, staleBoundary) as DashboardFocusTask,
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
    query: string,
    limit: number,
  ): Promise<WorkspaceTasksPage> => {
    const staleBoundary = getStaleTaskBoundary();
    const activeColumn = { status: { notIn: TERMINAL_COLUMN_STATUSES } };
    const normalizedQuery = query.trim();
    const searchWhere: Prisma.TaskWhereInput = normalizedQuery
      ? {
          OR: [
            { title: { contains: normalizedQuery, mode: "insensitive" } },
            {
              description: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};
    const filterWhere = (currentFilter: TasksFilter): Prisma.TaskWhereInput =>
      currentFilter === "open"
        ? { column: activeColumn }
        : currentFilter === "needs-attention"
          ? {
              OR: [
                { columnEnteredAt: { lte: staleBoundary } },
                { priority: "high" },
              ],
              column: activeColumn,
            }
          : currentFilter === "stale"
            ? {
                columnEnteredAt: { lte: staleBoundary },
                column: activeColumn,
              }
            : currentFilter === "high-priority"
              ? { priority: "high", column: activeColumn }
              : {};
    const whereFor = (currentFilter: TasksFilter): Prisma.TaskWhereInput => ({
      AND: [
        { column: { board: { userId } } },
        searchWhere,
        filterWhere(currentFilter),
      ],
    });
    const where = whereFor(filter);
    const countFilters: TasksFilter[] = [
      "all",
      "open",
      "needs-attention",
      "stale",
      "high-priority",
    ];

    const [tasks, totalCount, ...countResults] = await Promise.all([
      db.task.findMany({
        where,
        orderBy:
          filter === "all"
            ? [
                { column: { board: { order: "asc" } } },
                { column: { order: "asc" } },
                { order: "asc" },
                { id: "asc" },
              ]
            : [{ columnEnteredAt: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
        select: workspaceTaskSelect,
      }),
      db.task.count({ where }),
      ...countFilters.map((currentFilter) =>
        db.task.count({ where: whereFor(currentFilter) }),
      ),
    ]);

    const counts = Object.fromEntries(
      countFilters.map((currentFilter, index) => [
        currentFilter,
        countResults[index],
      ]),
    ) as Record<TasksFilter, number>;

    return {
      items: tasks.map((task) => toWorkspaceTask(task, staleBoundary)),
      totalCount,
      counts,
    };
  },
);

export const getColumnTasksPage = withUserId(
  async (
    userId: string,
    columnId: string,
    cursor: string | null,
    limit: number,
    priority: Priority | null,
  ): Promise<TaskPage> => {
    const where = {
      columnId,
      column: { board: { userId } },
      ...(priority && { priority }),
    } satisfies Prisma.TaskWhereInput;
    const [tasks, totalCount] = await Promise.all([
      db.task.findMany({
        where: {
          ...where,
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
          columnEnteredAt: true,
        },
      }),
      db.task.count({ where }),
    ]);

    const hasMore = tasks.length > limit;
    const page = hasMore ? tasks.slice(0, limit) : tasks;

    return {
      items: page.map((task) => ({
        ...task,
        columnEnteredAt: task.columnEnteredAt.toISOString(),
      })),
      nextCursor: hasMore ? (page.at(-1)?.order ?? null) : null,
      totalCount,
    };
  },
);
