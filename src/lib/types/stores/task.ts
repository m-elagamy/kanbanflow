import type { Task } from "@prisma/client";

export type TaskState = {
  tasks: Record<string, Task>;
  columnTaskIds: Record<string, string[]>;
  activeTaskId: string | null;
};

type TaskActions = {
  setTasks: (columnId: string, tasks: Task[]) => void;
  setActiveTask: (task: Task | null) => void;

  addTask: (columnId: string, task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
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
  getTask: (taskId: string) => Task | undefined;
  getColumnTasks: (columnId: string) => Task[];
};

export type TaskStore = TaskState & TaskActions & TaskSelectors;
