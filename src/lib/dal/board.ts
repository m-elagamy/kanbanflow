import db from "../db";
import { Board, type Column, type Priority, type Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { currentUser } from "@clerk/nextjs/server";
import { withUserId, withOwnership } from "@/utils/auth-wrappers";
import type { ColumnStatus } from "@/schemas/column";
import { generateKeyBetween } from "fractional-indexing";
import { TASKS_PAGE_SIZE } from "@/lib/constants";

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

const seedSampleTasks = async (
  tx: Prisma.TransactionClient,
  columns: Column[],
) => {
  const orderedColumns = [...columns].sort((a, b) => a.order - b.order);
  const lastOrderByColumn = new Map<string, string>();

  const data = SAMPLE_TASKS.map((task, index) => {
    const column =
      orderedColumns[
        Math.floor((index * orderedColumns.length) / SAMPLE_TASKS.length)
      ];
    const order = generateKeyBetween(
      lastOrderByColumn.get(column.id) ?? null,
      null,
    );
    lastOrderByColumn.set(column.id, order);

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

  await tx.task.createMany({ data });
};

const createBoard = withUserId(
  async (
    userId: string,
    requestId: string,
    title: string,
    slug: string,
    description?: string | null,
    columnsStatus?: ColumnStatus[],
  ): Promise<Board & { columns: Column[] }> => {
    // Reuse the board ID on retries, scoped to its owner.
    const boardId = `board_${createHash("sha256").update(`${userId}:${requestId}`).digest("hex")}`;
    const existing = await db.board.findUnique({
      where: { id: boardId, userId },
      include: { columns: { orderBy: { order: "asc" } } },
    });
    if (existing) return existing;

    let account = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!account) {
      const profile = await currentUser();
      const email = profile?.primaryEmailAddress?.emailAddress;
      if (!profile || profile.id !== userId || !email) {
        throw new Error(
          "Unable to prepare your account. Please sign in again.",
        );
      }
      account = { id: userId, name: profile.fullName, email };
    }
    const accountData = account;

    return db.$transaction(async (tx) => {
      // Lock the owner row to serialize concurrent board creation.
      const user = await tx.user.upsert({
        where: { id: userId },
        create: accountData,
        update: { id: userId },
      });

      const saved = await tx.board.findUnique({
        where: { id: boardId, userId },
        include: { columns: { orderBy: { order: "asc" } } },
      });
      if (saved) return saved;

      const minOrderResult = await tx.board.aggregate({
        where: { userId },
        _min: { order: true },
      });
      const isFirstBoard =
        !user.hasCreatedBoardOnce && minOrderResult._min.order === null;
      const board = await tx.board.create({
        data: {
          id: boardId,
          title,
          slug,
          description,
          userId,
          order: (minOrderResult._min.order ?? 0) - 1,
          columns: columnsStatus?.length
            ? {
                create: columnsStatus.map((status, order) => ({
                  status,
                  order,
                })),
              }
            : undefined,
        },
        include: { columns: { orderBy: { order: "asc" } } },
      });

      if (isFirstBoard && board.columns.length) {
        await seedSampleTasks(tx, board.columns);
      }
      await tx.user.update({
        where: { id: userId },
        data: { hasCreatedBoardOnce: true },
      });
      return board;
    });
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

const deleteBoard = withOwnership(async (userId: string, boardId: string) => {
  return db.board.delete({
    where: { id: boardId, userId },
  });
}, resolveBoardOwnerId);

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
          _count: { select: { tasks: true } },
          tasks: {
            orderBy: [{ order: "asc" }, { id: "asc" }],
            take: TASKS_PAGE_SIZE + 1,
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
    columns: board.columns.map((column) => {
      const hasMore = column.tasks.length > TASKS_PAGE_SIZE;
      const page = hasMore
        ? column.tasks.slice(0, TASKS_PAGE_SIZE)
        : column.tasks;

      return {
        id: column.id,
        status: column.status,
        order: column.order,
        totalCount: column._count.tasks,
        nextCursor: hasMore ? (page.at(-1)?.order ?? null) : null,
        tasks: page.map((task) => ({
          ...task,
          dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        })),
      };
    }),
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
