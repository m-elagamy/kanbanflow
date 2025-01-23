import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Board } from "@/lib/types/board";
import type Column from "@/lib/types/column";
import type { KanbanState } from "@/lib/types/kanban-state";
import { Task } from "@/lib/types/task";
import { findBoard, findColumn } from "@/utils/kanban-store";

const useKanbanStore = create<KanbanState>()(
  devtools(
    immer(
      persist(
        (set, get) => ({
          boards: [],
          activeBoardId: null,
          activeTask: null,

          getCurrentBoard: () => {
            const { boards, activeBoardId } = get();
            return findBoard(boards, activeBoardId) || null;
          },

          getColumns: () => {
            const currentBoard = get().getCurrentBoard();
            return currentBoard ? currentBoard.columns : [];
          },

          getColumnTasks: (columnId: string) => {
            const currentBoard = get().getCurrentBoard();
            const column = currentBoard?.columns.find(
              (col) => col.id === columnId,
            );
            return column ? column.tasks : [];
          },

          getTaskById: (columnId: string, taskId: string) => {
            const columnTasks = get().getColumnTasks(columnId);
            return columnTasks.find((task) => task.id === taskId) || null;
          },

          setActiveBoard: (id) =>
            set((state) => {
              state.activeBoardId = id;
            }),

          setActiveTask: (task) => set({ activeTask: task }),

          addBoard: (board) =>
            set((state) => {
              state.boards.push(board);
              state.activeBoardId = board.id;
            }),

          updateBoard: (boardId, updateFn) =>
            set((state) => {
              const boardIndex = state.boards.findIndex(
                (board) => board.id === boardId,
              );
              if (boardIndex !== -1) {
                const updatedBoard = updateFn(state.boards[boardIndex]);
                if (updatedBoard !== state.boards[boardIndex]) {
                  state.boards[boardIndex] = updatedBoard;
                }
              }
            }),

          deleteBoard: (boardId) =>
            set((state) => {
              state.boards = state.boards.filter(
                (board: Board) => board.id !== boardId,
              );
              state.activeBoardId =
                state.activeBoardId === boardId ? null : state.activeBoardId;
            }),

          addColumn: (boardId, column) =>
            set((state) => {
              const board = findBoard(state.boards, boardId);
              if (board) {
                board.columns.push(column);
              }
            }),

          updateColumn: (boardId, columnId, updateFn) =>
            set((state) => {
              const board = findBoard(state.boards, boardId);
              if (board) {
                const columnIndex = board.columns.findIndex(
                  (col: Column) => col.id === columnId,
                );
                if (columnIndex !== -1) {
                  board.columns[columnIndex] = updateFn(
                    board.columns[columnIndex],
                  );
                }
              }
            }),

          deleteColumn: (boardId, columnId) =>
            set((state) => {
              const board = findBoard(state.boards, boardId);
              if (board) {
                board.columns = board.columns.filter(
                  (col: Column) => col.id !== columnId,
                );
              }
            }),

          addTask: (boardId, columnId, task) =>
            set((state) => {
              const board = findBoard(state.boards, boardId);
              if (board) {
                const column = findColumn(board, columnId);
                if (column) {
                  column.tasks.push(task);
                }
              }
            }),

          updateTask: (boardId, columnId, taskId, updateFn) =>
            set((state) => {
              const board = findBoard(state.boards, boardId);
              if (board) {
                const column = findColumn(board, columnId);
                if (column) {
                  const taskIndex = column.tasks.findIndex(
                    (task: Task) => task.id === taskId,
                  );
                  if (taskIndex !== -1) {
                    column.tasks[taskIndex] = updateFn(column.tasks[taskIndex]);
                  }
                }
              }
            }),

          deleteTask: (boardId, columnId, taskId) =>
            set((state) => {
              const board = findBoard(state.boards, boardId);
              if (board) {
                const column = findColumn(board, columnId);
                if (column) {
                  column.tasks = column.tasks.filter(
                    (task: Task) => task.id !== taskId,
                  );
                }
              }
            }),

          moveTask: (
            taskId,
            sourceColumnId,
            destinationColumnId,
            destinationIndex,
          ) =>
            set((state) => {
              const board = findBoard(state.boards, get().activeBoardId);

              if (board) {
                const sourceColumn = findColumn(board, sourceColumnId);
                const destinationColumn = findColumn(
                  board,
                  destinationColumnId,
                );

                if (sourceColumn && destinationColumn) {
                  const taskIndex = sourceColumn.tasks.findIndex(
                    (task: Task) => task.id === taskId,
                  );

                  if (taskIndex !== -1) {
                    const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
                    destinationColumn.tasks.splice(
                      destinationIndex,
                      0,
                      movedTask,
                    );
                  }
                }
              }
            }),
        }),

        {
          name: "kanban-storage",
          partialize: (state) => ({
            boards: state.boards,
            activeBoardId: state.activeBoardId,
          }),
        },
      ),
    ),
    { name: "KanbanStore" },
  ),
);

export default useKanbanStore;
