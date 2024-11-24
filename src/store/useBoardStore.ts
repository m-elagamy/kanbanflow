import { create } from "zustand";
import type Column from "@/lib/types/column";
import type Task from "@/lib/types/task";

export type Board = {
  id: string;
  title: string;
  description?: string;
  columns: Column[];
};

export type BoardState = {
  boards: Board[];
  addBoard: (board: Board) => void;
  addTask: (task: Task) => void;
  addColumn: (boardId: string, column: Column) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
};

const useBoardStore = create<BoardState>((set) => ({
  boards: [],

  addBoard: (board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),

  addTask: (task) =>
    set((state) => ({
      boards: state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === task.columnId
            ? { ...column, tasks: [...(column.tasks || []), task] }
            : column,
        ),
      })),
    })),

  addColumn: (boardId, column) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, columns: [...board.columns, column] }
          : board,
      ),
    })),

  deleteColumn: (boardId, columnId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.filter((col) => col.id !== columnId),
            }
          : board,
      ),
    })),
}));

export default useBoardStore;
