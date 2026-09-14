import type { ClientTask } from "@/lib/types";
import type { PriorityFilterValue } from "@/stores/task-filter";

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

export type TaskSnapshot = {
  tasks: Record<string, ClientTask>;
  columnTaskIds: Record<string, string[]>;
  columnPages: Record<string, ColumnTaskPageState>;
} | null;

export type TaskState = {
  tasks: Record<string, ClientTask>;
  columnTaskIds: Record<string, string[]>;
  columnPages: Record<string, ColumnTaskPageState>;
  activeTaskId: string | null;
  previousState: TaskSnapshot;
};

type TaskActions = {
  initializeTaskPages: (pages: InitialColumnTaskPage[]) => void;
  replaceColumnTaskPage: (
    columnId: string,
    tasks: ClientTask[],
    nextCursor: string | null,
    filter: PriorityFilterValue,
  ) => void;
  appendColumnTaskPage: (
    columnId: string,
    tasks: ClientTask[],
    nextCursor: string | null,
  ) => void;
  setColumnPageLoading: (columnId: string, isLoading: boolean) => void;
  setColumnPageError: (columnId: string, error: string | null) => void;
  setActiveTask: (task: ClientTask | null) => void;

  addTask: (columnId: string, task: ClientTask) => void;
  updateTask: (taskId: string, updates: Partial<ClientTask>) => void;
  deleteTask: (columnId: string, taskId: string) => void;
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

  rollback: () => void;
};

type TaskSelectors = {
  getTask: (taskId: string) => ClientTask | undefined;
  getColumnTasks: (columnId: string) => ClientTask[];
};

export type TaskStore = TaskState & TaskActions & TaskSelectors;
