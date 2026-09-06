import db from "../db";
import { Board, type Column, type Priority } from "@prisma/client";
import { withUserId, withOwnership } from "@/utils/auth-wrappers";
import type { ColumnStatus } from "@/schemas/column";
import { BOARDS_LIST_LIMIT } from "../constants";

const resolveBoardOwnerId = async (boardId: string) => {
  const board = await db.board.findUnique({
    where: { id: boardId },
    select: { userId: true },
  });
  return board?.userId;
};

const SAMPLE_TASKS: {
  title: string;
  description: string;
  priority: Priority;
  dueInDays?: number;
}[] = [
  {
    title: "Explore your board",
    description:
      "Drag this card into another column — KanbanFlow saves the move instantly.",
    priority: "low",
  },
  {
    title: "Set a due date",
    description:
      "Open this task and add a deadline. Overdue tasks are easy to spot at a glance.",
    priority: "medium",
    dueInDays: 3,
  },
  {
    title: "Filter by priority",
    description:
      "Use the filter in the board toolbar to show only high-priority tasks.",
    priority: "high",
  },
  {
    title: "Reorder your columns",
    description: "Drag a column by its header to rearrange your workflow.",
    priority: "medium",
  },
  {
    title: "Make this board yours",
    description:
      "Delete these sample tasks whenever you're ready and add your own.",
    priority: "low",
  },
];

const seedSampleTasks = async (columns: Column[]) => {
  const orderedColumns = [...columns].sort((a, b) => a.order - b.order);
  const orderByColumn = new Map<string, number>();

  const data = SAMPLE_TASKS.map((task, index) => {
    const column =
      orderedColumns[
        Math.floor((index * orderedColumns.length) / SAMPLE_TASKS.length)
      ];
    const order = orderByColumn.get(column.id) ?? 0;
    orderByColumn.set(column.id, order + 1);

    return {
      title: task.title,
      description: task.description,
      priority: task.priority,
      columnId: column.id,
      order,
      dueDate: task.dueInDays
        ? new Date(Date.now() + task.dueInDays * 24 * 60 * 60 * 1000)
        : null,
    };
  });

  await db.task.createMany({ data });
};

const createBoard = withUserId(
  async (
    userId: string,
    title: string,
    slug: string,
    description?: string | null,
    columnsStatus?: ColumnStatus[],
  ): Promise<Board & { columns: Column[] }> => {
    const minOrderResult = await db.board.aggregate({
      where: { userId },
      _min: { order: true },
      take: BOARDS_LIST_LIMIT,
    });

    const isFirstBoard = minOrderResult._min.order === null;
    const newOrder = (minOrderResult._min.order ?? 0) - 1;

    const board = await db.board.create({
      data: {
        title,
        slug,
        description,
        userId,
        order: newOrder,
        columns: columnsStatus?.length
          ? {
              create: columnsStatus.map((status, index) => ({
                status,
                order: index,
              })),
            }
          : undefined,
      },
      include: { columns: true },
    });

    if (isFirstBoard && board.columns.length) {
      await seedSampleTasks(board.columns);
    }

    return board;
  },
);

const updateBoard = withOwnership(
  async (
    userId: string,
    boardId: string,
    data: Partial<Omit<Board, "id" | "userId" | "order">>,
  ) => {
    return db.board.update({
      where: { id: boardId, userId },
      data,
    });
  },
  resolveBoardOwnerId,
);

const deleteBoard = withOwnership(
  async (userId: string, boardId: string) => {
    return db.board.delete({
      where: { id: boardId, userId },
    });
  },
  resolveBoardOwnerId,
);

const getBoardForRename = withOwnership(
  async (userId: string, boardId: string) => {
    return db.board.findUnique({
      where: { id: boardId, userId },
      select: { title: true, description: true },
    });
  },
  resolveBoardOwnerId,
);

const countBoardsBySlug = withOwnership(
  async (userId: string, boardId: string, slug: string) => {
    return db.board.count({
      where: { userId, slug, NOT: { id: boardId } },
    });
  },
  resolveBoardOwnerId,
);

const getBoardBySlug = withUserId(async (userId: string, slug: string) => {
  const board = await db.board.findUnique({
    where: { userId_slug: { userId, slug } },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      columns: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          status: true,
          order: true,
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              priority: true,
              description: true,
              columnId: true,
              dueDate: true,
            },
          },
        },
      },
    },
  });

  if (!board) return null;

  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      })),
    })),
  };
});

export {
  createBoard,
  getBoardBySlug,
  updateBoard,
  deleteBoard,
  getBoardForRename,
  countBoardsBySlug,
};
