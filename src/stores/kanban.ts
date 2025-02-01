import { create } from "zustand";
import { produce } from "immer";
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
}));
