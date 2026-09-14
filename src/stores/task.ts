import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import type { TaskState, TaskStore } from "@/lib/types/stores/task";

const initialState: TaskState = {
  tasks: {},
  columnTaskIds: {},
  columnPages: {},
  activeTaskId: null,
  previousState: null,
};

const snapshotState = (state: TaskState) => ({
  tasks: { ...state.tasks },
  columnTaskIds: Object.fromEntries(
    Object.entries(state.columnTaskIds).map(([columnId, taskIds]) => [
      columnId,
      [...taskIds],
    ]),
  ),
  columnPages: Object.fromEntries(
    Object.entries(state.columnPages).map(([columnId, page]) => [
      columnId,
      { ...page },
    ]),
  ),
});

export const useTaskStore = create<TaskStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,

      initializeTaskPages: (pages) => {
        set((state) => {
          state.tasks = {};
          state.columnTaskIds = {};
          state.columnPages = {};

          for (const page of pages) {
            state.columnTaskIds[page.columnId] = page.tasks.map(
              (task) => task.id,
            );
            state.columnPages[page.columnId] = {
              nextCursor: page.nextCursor,
              totalCount: page.totalCount,
              isLoading: false,
              error: null,
              filter: "all",
            };
            for (const task of page.tasks) {
              state.tasks[task.id] = task;
            }
          }
        });
      },

      replaceColumnTaskPage: (columnId, tasks, nextCursor, filter) => {
        set((state) => {
          state.columnTaskIds[columnId] = tasks.map((task) => task.id);
          for (const task of tasks) state.tasks[task.id] = task;

          const current = state.columnPages[columnId];
          state.columnPages[columnId] = {
            nextCursor,
            totalCount: current?.totalCount ?? tasks.length,
            isLoading: false,
            error: null,
            filter,
          };
        });
      },

      appendColumnTaskPage: (columnId, tasks, nextCursor) => {
        set((state) => {
          const ids = state.columnTaskIds[columnId] ?? [];
          const existingIds = new Set(ids);
          for (const task of tasks) {
            state.tasks[task.id] = task;
            if (!existingIds.has(task.id)) {
              ids.push(task.id);
              existingIds.add(task.id);
            }
          }
          state.columnTaskIds[columnId] = ids;

          if (state.columnPages[columnId]) {
            state.columnPages[columnId].nextCursor = nextCursor;
            state.columnPages[columnId].isLoading = false;
            state.columnPages[columnId].error = null;
          }
        });
      },

      setColumnPageLoading: (columnId, isLoading) => {
        set((state) => {
          if (state.columnPages[columnId]) {
            state.columnPages[columnId].isLoading = isLoading;
          }
        });
      },

      setColumnPageError: (columnId, error) => {
        set((state) => {
          if (state.columnPages[columnId]) {
            state.columnPages[columnId].error = error;
            state.columnPages[columnId].isLoading = false;
          }
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
          state.previousState = snapshotState(state);

          state.tasks[task.id] = task;

          if (!state.columnTaskIds[columnId]) {
            state.columnTaskIds[columnId] = [];
          }

          const page = state.columnPages[columnId];
          if (page) {
            page.totalCount += 1;
            if (page.filter === "all" || page.filter === task.priority) {
              state.columnTaskIds[columnId].push(task.id);
            }
          } else {
            state.columnTaskIds[columnId].push(task.id);
          }
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => {
          if (!state.tasks[taskId]) return;

          state.previousState = snapshotState(state);

          state.tasks[taskId] = {
            ...state.tasks[taskId],
            ...updates,
          };

          const task = state.tasks[taskId];
          const page = state.columnPages[task.columnId];
          if (page && page.filter !== "all" && page.filter !== task.priority) {
            state.columnTaskIds[task.columnId] = (
              state.columnTaskIds[task.columnId] ?? []
            ).filter((id) => id !== taskId);
          }
        });
      },

      deleteTask: (columnId, taskId) => {
        set((state) => {
          state.previousState = snapshotState(state);

          delete state.tasks[taskId];

          if (state.columnTaskIds[columnId]) {
            state.columnTaskIds[columnId] = state.columnTaskIds[
              columnId
            ].filter((id) => id !== taskId);

            if (state.columnTaskIds[columnId].length === 0) {
              delete state.columnTaskIds[columnId];
            }
          }

          const page = state.columnPages[columnId];
          if (page) page.totalCount = Math.max(0, page.totalCount - 1);

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

          state.previousState = snapshotState(state);

          column.splice(oldIndex, 1);
          column.splice(newIndex, 0, activeTaskId);
        });
      },

      moveTaskBetweenColumns: (
        taskId,
        fromColumnId,
        toColumnId,
        targetTaskId,
        includeInDestination = true,
      ) => {
        set((state) => {
          const fromColumn = state.columnTaskIds[fromColumnId];
          if (!fromColumn) return;

          state.previousState = snapshotState(state);

          if (!state.columnTaskIds[toColumnId]) {
            state.columnTaskIds[toColumnId] = [];
          }

          const toColumn = state.columnTaskIds[toColumnId];
          const fromIndex = fromColumn.indexOf(taskId);

          if (fromIndex === -1) return;

          fromColumn.splice(fromIndex, 1);

          if (includeInDestination) {
            let toIndex = targetTaskId
              ? toColumn.indexOf(targetTaskId)
              : toColumn.length;

            if (toIndex === -1) toIndex = toColumn.length;

            toColumn.splice(toIndex, 0, taskId);
          }

          if (fromColumnId !== toColumnId) {
            const sourcePage = state.columnPages[fromColumnId];
            const targetPage = state.columnPages[toColumnId];
            if (sourcePage) {
              sourcePage.totalCount = Math.max(0, sourcePage.totalCount - 1);
            }
            if (targetPage) targetPage.totalCount += 1;
          }
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

      rollback: () => {
        set((state) => {
          if (!state.previousState) return;

          state.tasks = state.previousState.tasks;
          state.columnTaskIds = state.previousState.columnTaskIds;
          state.columnPages = state.previousState.columnPages;
          state.previousState = null;
        });
      },
    })),
  ),
);
