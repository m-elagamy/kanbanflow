import { create } from "zustand";
import { Column, Task } from "@prisma/client";
import { arrayMove } from "@dnd-kit/sortable";

type ColumnWithTasks = Column & { tasks: Task[] };

type KanbanState = {
  activeTask: Task | null;
  columns: ColumnWithTasks[];
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
};

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: [],
  activeTask: null,
  setActiveTask: (activeTask) => set(() => ({ activeTask })),
  setColumns: (columns) => set(() => ({ columns })),

  reorderTaskWithinColumn: (columnId, activeTaskId, overId) =>
    set((state) => {
      const columns = state.columns.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));

      const column = columns.find((col) => col.id === columnId);
      if (!column) return { columns };

      const oldIndex = column.tasks.findIndex(
        (task) => task.id === activeTaskId,
      );
      const newIndex = column.tasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1) return { columns };

      column.tasks = arrayMove(column.tasks, oldIndex, newIndex);

      return { columns };
    }),

  moveTaskBetweenColumns: (taskId, fromColumnId, toColumnId, targetTaskId) =>
    set((state) => {
      const columns = state.columns.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));

      const fromColumn = columns.find((col) => col.id === fromColumnId);
      const toColumn = columns.find((col) => col.id === toColumnId);

      if (!fromColumn || !toColumn) return { columns };

      const taskIndex = fromColumn.tasks.findIndex(
        (task) => task.id === taskId,
      );
      if (taskIndex === -1) return { columns };

      const [task] = fromColumn.tasks.splice(taskIndex, 1);

      const targetIndex = targetTaskId
        ? toColumn.tasks.findIndex((task) => task.id === targetTaskId)
        : toColumn.tasks.length;

      toColumn.tasks.splice(targetIndex, 0, task);

      return { columns };
    }),
}));
