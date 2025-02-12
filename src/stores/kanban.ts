import { create } from "zustand";
import { produce } from "immer";
import { Column, Task } from "@prisma/client";
import { arrayMove } from "@dnd-kit/sortable";

type ColumnWithTasks = Column & { tasks: Task[] };

export type Priority = "high" | "medium" | "low" | "all";

type KanbanState = {
  activeTask: Task | null;
  columns: ColumnWithTasks[];
  priorityFilter: Priority;
  boardFilters: { boardSlug: string; priority: Priority }[];
  setPriorityFilter: (boardSlug: string, filter: Priority) => void;
  resetBoardFilter: (boardSlug: string) => void;
  setActiveTask: (task: Task | null) => void;
  setColumns: (columns: ColumnWithTasks[]) => void;
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
  getFilteredTasks: (boardSlug: string, columnId: string) => Task[];

  // Column operations
  addColumn: (column: Column) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;

  // Task operations
  addTask: (columnId: string, task: Task) => void;
  updateTask: (
    columnId: string,
    taskId: string,
    updates: Partial<Task>,
  ) => void;
  deleteTask: (columnId: string, taskId: string) => void;
};

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: [],
  activeTask: null,
  priorityFilter: "all",
  boardFilters: [],
  setPriorityFilter: (boardSlug, priority) =>
    set((state) => {
      const boardFilters = state.boardFilters.filter(
        (filter) => filter.boardSlug !== boardSlug,
      );

      if (priority !== "all") {
        boardFilters.push({ boardSlug, priority });
      }

      const priorityFilter =
        boardFilters.find((filter) => filter.boardSlug === boardSlug)
          ?.priority || "all";

      return { boardFilters, priorityFilter };
    }),

  resetBoardFilter: (boardSlug) =>
    set((state) => {
      const boardFilters = state.boardFilters.filter(
        (filter) => filter.boardSlug !== boardSlug,
      );

      const priorityFilter =
        boardFilters.find((filter) => filter.boardSlug === boardSlug)
          ?.priority || "all";

      return { boardFilters, priorityFilter };
    }),

  setActiveTask: (activeTask) => set(() => ({ activeTask })),
  setColumns: (columns) => set(() => ({ columns })),

  addColumn: (column) => {
    set((state) => ({
      columns: [...state.columns, { ...column, tasks: [] }],
    }));
  },

  updateColumn: (columnId, updates) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col,
      ),
    }));
  },

  deleteColumn: (columnId) => {
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== columnId),
    }));
  },

  addTask: (columnId, task) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col,
      ),
    }));
  },

  updateTask: (columnId, taskId, updates) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task,
              ),
            }
          : col,
      ),
    }));
  },

  deleteTask: (columnId, taskId) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col,
      ),
    }));
  },

  reorderTaskWithinColumn: (columnId, activeTaskId, overId) =>
    set(
      produce((state) => {
        const column = state.columns.find(
          (col: ColumnWithTasks) => col.id === columnId,
        );
        if (!column) return;

        const oldIndex = column.tasks.findIndex(
          (task: Task) => task.id === activeTaskId,
        );
        const newIndex = column.tasks.findIndex(
          (task: Task) => task.id === overId,
        );

        if (oldIndex === newIndex || oldIndex === -1 || newIndex === -1) return;

        column.tasks = arrayMove(column.tasks, oldIndex, newIndex);
      }),
    ),

  moveTaskBetweenColumns: (taskId, fromColumnId, toColumnId, targetTaskId) =>
    set(
      produce((state) => {
        const fromColumn = state.columns.find(
          (col: ColumnWithTasks) => col.id === fromColumnId,
        );
        const toColumn = state.columns.find(
          (col: ColumnWithTasks) => col.id === toColumnId,
        );

        if (!fromColumn || !toColumn) return;

        const taskIndex = fromColumn.tasks.findIndex(
          (task: Task) => task.id === taskId,
        );
        if (taskIndex === -1) return;

        const [task] = fromColumn.tasks.splice(taskIndex, 1);

        let targetIndex = toColumn.tasks.findIndex(
          (task: Task) => task.id === targetTaskId,
        );

        if (targetIndex === -1) {
          targetIndex = toColumn.tasks.length;
        }

        toColumn.tasks.splice(targetIndex, 0, task);
      }),
    ),
  getFilteredTasks: (boardSlug, columnId) => {
    const state = get();
    const column = state.columns.find((col) => col.id === columnId);
    const boardFilter =
      state.boardFilters.find((f) => f.boardSlug === boardSlug)?.priority ||
      "all";

    if (!column) return [];

    return column.tasks.filter((task) => {
      if (boardFilter === "all") return true;
      return task.priority === boardFilter;
    });
  },
}));
