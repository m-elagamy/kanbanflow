import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import type { TaskState, TaskStore } from "@/lib/types/stores/task";

const initialState: TaskState = {
  tasks: {},
  columnTaskIds: {},
  activeTaskId: null,
};

export const useTaskStore = create<TaskStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,

      setTasks: (columnId, tasks) => {
        set((state) => {
          tasks.forEach((task) => {
            state.tasks[task.id] = task;
          });

          state.columnTaskIds[columnId] = tasks.map((task) => task.id);
        });
      },

      setActiveTask: (task) => {
        set((state) => {
          state.activeTaskId = task?.id || null;

          if (task) {
            state.tasks[task.id] = task;
          }
        });
      },

      addTask: (columnId, task) => {
        set((state) => {
          state.tasks[task.id] = task;

          if (!state.columnTaskIds[columnId]) {
            state.columnTaskIds[columnId] = [];
          }

          state.columnTaskIds[columnId].push(task.id);
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => {
          if (!state.tasks[taskId]) return;

          state.tasks[taskId] = {
            ...state.tasks[taskId],
            ...updates,
          };
        });
      },

      deleteTask: (columnId, taskId) => {
        set((state) => {
          delete state.tasks[taskId];

          if (state.columnTaskIds[columnId]) {
            state.columnTaskIds[columnId] = state.columnTaskIds[
              columnId
            ].filter((id) => id !== taskId);
          }

          if (state.activeTaskId === taskId) {
            state.activeTaskId = null;
          }
        });
      },

      updateTaskId: (oldTaskId, newTaskId) => {
        if (oldTaskId === newTaskId) return;

        set((state) => {
          const task = state.tasks[oldTaskId];
          if (!task) return;

          state.tasks[newTaskId] = {
            ...task,
            id: newTaskId,
          };

          delete state.tasks[oldTaskId];

          Object.keys(state.columnTaskIds).forEach((columnId) => {
            const column = state.columnTaskIds[columnId];
            const index = column.indexOf(oldTaskId);

            if (index !== -1) {
              column[index] = newTaskId;
            }
          });

          if (state.activeTaskId === oldTaskId) {
            state.activeTaskId = newTaskId;
          }
        });
      },

      reorderTaskWithinColumn: (columnId, activeTaskId, overId) => {
        set((state) => {
          const column = state.columnTaskIds[columnId];
          if (!column) return;

          const oldIndex = column.indexOf(activeTaskId);
          const newIndex = column.indexOf(overId);

          if (oldIndex === -1 || newIndex === -1) return;

          column.splice(oldIndex, 1);
          column.splice(newIndex, 0, activeTaskId);
        });
      },

      moveTaskBetweenColumns: (
        taskId,
        fromColumnId,
        toColumnId,
        targetTaskId,
      ) => {
        set((state) => {
          const fromColumn = state.columnTaskIds[fromColumnId];
          if (!fromColumn) return;

          if (!state.columnTaskIds[toColumnId]) {
            state.columnTaskIds[toColumnId] = [];
          }

          const toColumn = state.columnTaskIds[toColumnId];
          const fromIndex = fromColumn.indexOf(taskId);

          if (fromIndex === -1) return;

          fromColumn.splice(fromIndex, 1);

          let toIndex = targetTaskId
            ? toColumn.indexOf(targetTaskId)
            : toColumn.length;

          if (toIndex === -1) toIndex = toColumn.length;

          toColumn.splice(toIndex, 0, taskId);
        });
      },

      getTask: (taskId: string) => {
        return get().tasks[taskId];
      },

      getColumnTasks: (columnId: string) => {
        const state = get();
        const taskIds = state.columnTaskIds[columnId] || [];
        return taskIds.map((id) => state.tasks[id]).filter(Boolean);
      },
    })),
  ),
);
