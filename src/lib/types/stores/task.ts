import type { ClientTask } from "@/lib/types";

export type TaskSnapshot = {
  tasks: Record<string, ClientTask>;
  columnTaskIds: Record<string, string[]>;
} | null;

export type TaskState = {
  tasks: Record<string, ClientTask>;
  columnTaskIds: Record<string, string[]>;
  activeTaskId: string | null;
  previousState: TaskSnapshot;
};

type TaskActions = {
  setTasks: (tasks: ClientTask[]) => void;
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
  ) => void;

  rollback: () => void;
};

type TaskSelectors = {
  getTask: (taskId: string) => ClientTask | undefined;
  getColumnTasks: (columnId: string) => ClientTask[];
};

export type TaskStore = TaskState & TaskActions & TaskSelectors;
