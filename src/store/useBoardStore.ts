import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Task from "@/lib/types/task";
import Column from "@/lib/types/column";
import { slugifyTitle } from "@/app/board/utils/slugify";

export type Board = {
  id: string;
  title: string;
  description?: string;
  columns: Column[];
};

export type BoardState = {
  boards: Board[]; // List of all boards
  currentBoardId: string | null; // ID of the currently selected board

  // Getters
  getCurrentBoard: () => Board | null;

  // Setters
  setCurrentBoardId: (boardId: string | null) => void;
  setCurrentBoardBySlug: (slug: string) => void;

  // Actions
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updateFn: (board: Board) => Board) => void;
  deleteBoard: (boardId: string) => void;

  addColumn: (boardId: string, column: Column) => void;
  updateColumn: (
    boardId: string,
    columnId: string,
    updateFn: (col: Column) => Column,
  ) => void;
  deleteColumn: (boardId: string, columnId: string) => void;

  addTask: (boardId: string, columnId: string, task: Task) => void;
  updateTask: (
    boardId: string,
    columnId: string,
    taskId: string,
    updateFn: (task: Task) => Task,
  ) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
  ) => void;
};

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    boards: [],
    currentBoardId: null,

    // Get the current board based on the currentBoardId
    getCurrentBoard: () => {
      const { boards, currentBoardId } = get();
      return boards.find((board) => board.id === currentBoardId) || null;
    },

    // Set the current board ID directly
    setCurrentBoardId: (boardId) => set({ currentBoardId: boardId }),

    // Set the current board based on the slug
    setCurrentBoardBySlug: (slug) => {
      const board = get().boards.find((b) => slugifyTitle(b.title) === slug);
      set({ currentBoardId: board ? board.id : null });
    },

    // Add a new board
    addBoard: (board) => {
      set((state) => ({
        boards: [...state.boards, board],
        currentBoardId: board.id,
      }));
    },

    // Update a board
    updateBoard: (boardId, updateFn) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? updateFn(board) : board,
        ),
      }));
    },

    // Delete a board
    deleteBoard: (boardId) => {
      set((state) => ({
        boards: state.boards.filter((board) => board.id !== boardId),
        currentBoardId:
          state.currentBoardId === boardId ? null : state.currentBoardId,
      }));
    },

    // Add a new column
    addColumn: (boardId, column) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? { ...board, columns: [...board.columns, column] }
            : board,
        ),
      }));
    },

    // Update an existing column
    updateColumn: (boardId, columnId, updateFn) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === columnId ? updateFn(col) : col,
                ),
              }
            : board,
        ),
      }));
    },

    // Delete a column
    deleteColumn: (boardId, columnId) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.filter((col) => col.id !== columnId),
              }
            : board,
        ),
      }));
    },

    // Add a new task
    addTask: (boardId, columnId, task) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === columnId
                    ? { ...col, tasks: [...col.tasks, task] }
                    : col,
                ),
              }
            : board,
        ),
      }));
    },

    // Update an existing task
    updateTask: (boardId, columnId, taskId, updateFn) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === columnId
                    ? {
                        ...col,
                        tasks: col.tasks.map((task) =>
                          task.id === taskId ? updateFn(task) : task,
                        ),
                      }
                    : col,
                ),
              }
            : board,
        ),
      }));
    },

    // Delete a task
    deleteTask: (boardId, columnId, taskId) => {
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === columnId
                    ? {
                        ...col,
                        tasks: col.tasks.filter((task) => task.id !== taskId),
                      }
                    : col,
                ),
              }
            : board,
        ),
      }));
    },

    moveTask: (taskId, sourceColumnId, destinationColumnId) => {
      const currentBoard = get().getCurrentBoard();
      if (!currentBoard) return;

      const sourceColumn = currentBoard.columns.find(
        (col) => col.id === sourceColumnId,
      );
      const task = sourceColumn?.tasks.find((t) => t.id === taskId);

      if (!sourceColumn || !task) return;

      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === currentBoard.id
            ? {
                ...board,
                columns: board.columns.map((col) => {
                  if (col.id === sourceColumnId) {
                    return {
                      ...col,
                      tasks: col.tasks.filter((t) => t.id !== taskId),
                    };
                  }
                  if (col.id === destinationColumnId) {
                    return {
                      ...col,
                      tasks: [...col.tasks, task],
                    };
                  }
                  return col;
                }),
              }
            : board,
        ),
      }));
    },
  })),
);

export default useBoardStore;
