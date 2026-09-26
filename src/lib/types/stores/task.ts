import type { ClientTask } from "@/lib/types";
import type { Priority } from "@prisma/client";

export type PriorityFilterValue = Priority | "all";

export type ColumnTaskPageState = {
  nextCursor: string | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filter: PriorityFilterValue;
};

export type InitialColumnTaskPage = {
  columnId: string;
  tasks: ClientTask[];
  nextCursor: string | null;
  totalCount: number;
};

export type TaskOperation =
  | {
      kind: "add";
      boardId: string | null;
      taskId: string;
      columnId: string;
      optimisticTask: ClientTask;
    }
  | {
      kind: "update";
      boardId: string | null;
      taskId: string;
      previousTask: ClientTask;
      optimisticTask: ClientTask;
      updatedKeys: (keyof ClientTask)[];
      previousMembership: boolean;
      previousIndex: number;
    }
  | {
      kind: "delete";
      boardId: string | null;
      taskId: string;
      columnId: string;
      previousTask: ClientTask;
      previousIndex: number;
    }
  | {
      kind: "drag";
      boardId: string | null;
      taskId: string;
      previousColumnId: string;
      previousIndex: number;
    };

export type TaskState = {
  activeBoardId: string | null;
  tasks: Record<string, ClientTask>;
  columnTaskIds: Record<string, string[]>;
  columnPages: Record<string, ColumnTaskPageState>;
  activeTaskId: string | null;
  optimisticOperations: Record<string, TaskOperation>;
};

type TaskActions = {
  initializeTaskPages: (
    boardId: string,
    pages: InitialColumnTaskPage[],
  ) => void;
  replaceColumnTaskPage: (
    columnId: string,
    tasks: ClientTask[],
    nextCursor: string | null,
    filter: PriorityFilterValue,
    totalCount: number,
  ) => void;
  appendColumnTaskPage: (
    columnId: string,
    tasks: ClientTask[],
    nextCursor: string | null,
  ) => void;
  setColumnPageLoading: (columnId: string, isLoading: boolean) => void;
  setColumnPageError: (columnId: string, error: string | null) => void;
  setActiveTask: (task: ClientTask | null) => void;
  captureSnapshot: (taskId?: string) => string | null;
  clearSnapshot: (operationId?: string) => void;

  addTask: (columnId: string, task: ClientTask) => string | null;
  updateTask: (
    taskId: string,
    updates: Partial<ClientTask>,
    operationId?: string,
  ) => string | null;
  deleteTask: (columnId: string, taskId: string) => string | null;
  updateTaskId: (oldTaskId: string, newTaskId: string) => void;

  reorderTaskWithinColumn: (
    columnId: string,
    activeTaskId: string,
    overId: string,
  ) => void;
  moveTaskBetweenColumns: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    targetTaskId?: string,
    includeInDestination?: boolean,
  ) => void;

  rollback: (operationId?: string) => void;
};

type TaskSelectors = {
  getTask: (taskId: string) => ClientTask | undefined;
  getColumnTasks: (columnId: string) => ClientTask[];
};

export type TaskStore = TaskState & TaskActions & TaskSelectors;
