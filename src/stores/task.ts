import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Task } from "@prisma/client";
import { arrayMove } from "@dnd-kit/sortable";
import { subscribeWithSelector } from "zustand/middleware";

type TaskState = {
  tasks: Record<string, Task[]>;
  activeTask: Task | null;

  setTasks: (columnId: string, tasks: Task[]) => void;
  setActiveTask: (task: Task | null) => void;

  addTask: (columnId: string, task: Task) => void;
  updateTask: (
    columnId: string,
    taskId: string,
    updates: Partial<Task>,
  ) => void;
  deleteTask: (columnId: string, taskId: string) => void;
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

export const useTaskStore = create<TaskState>()(
  subscribeWithSelector(
    immer((set) => ({
      tasks: {},
      activeTask: null,

      setTasks: (columnId, tasks) => {
        set((state) => {
          state.tasks[columnId] = tasks;
        });
      },

      setActiveTask: (task) => {
        set((state) => {
          state.activeTask = task;
        });
      },

      addTask: (columnId, task) => {
        set((state) => {
          state.tasks[columnId] = [...(state.tasks[columnId] || []), task];
        });
      },

      updateTask: (columnId, taskId, updates) => {
        set((state) => {
          const tasks = state.tasks[columnId];
          if (!tasks) return;
          const task = tasks.find((t) => t.id === taskId);
          if (task) Object.assign(task, updates);
        });
      },

      deleteTask: (columnId, taskId) => {
        set((state) => {
          const tasks = state.tasks[columnId];
          if (!tasks) return;
          state.tasks[columnId] = tasks.filter((t) => t.id !== taskId);
        });
      },

      reorderTaskWithinColumn: (columnId, activeTaskId, overId) => {
        set((state) => {
          const tasks = state.tasks[columnId];
          if (!tasks) return;
          const oldIndex = tasks.findIndex((t) => t.id === activeTaskId);
          const newIndex = tasks.findIndex((t) => t.id === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            state.tasks[columnId] = arrayMove(tasks, oldIndex, newIndex);
          }
        });
      },

      moveTaskBetweenColumns: (
        taskId,
        fromColumnId,
        toColumnId,
        targetTaskId,
      ) => {
        set((state) => {
          const fromTasks = state.tasks[fromColumnId];
          const toTasks = state.tasks[toColumnId] || [];

          const taskIndex = fromTasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return;

          const [task] = fromTasks.splice(taskIndex, 1);

          let targetIndex = toTasks.findIndex((t) => t.id === targetTaskId);
          if (targetIndex === -1) targetIndex = toTasks.length;

          toTasks.splice(targetIndex, 0, task);

          state.tasks[toColumnId] = toTasks;
        });
      },
    })),
  ),
);
