import type { Task } from "@prisma/client";

export type SimplifiedTask = Omit<Task, "columnId">;

export type TaskState = {
  tasks: Record<string, SimplifiedTask>;
  columnTaskIds: Record<string, string[]>;
  activeTaskId: string | null;
};

type TaskActions = {
  setTasks: (columnId: string, tasks: SimplifiedTask[]) => void;
  setActiveTask: (task: SimplifiedTask | null) => void;

  addTask: (columnId: string, task: SimplifiedTask) => void;
  updateTask: (taskId: string, updates: Partial<SimplifiedTask>) => void;
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
};

type TaskSelectors = {
  getTask: (taskId: string) => SimplifiedTask | undefined;
  getColumnTasks: (columnId: string) => SimplifiedTask[];
};

export type TaskStore = TaskState & TaskActions & TaskSelectors;
