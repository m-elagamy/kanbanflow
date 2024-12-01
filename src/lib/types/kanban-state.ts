import type { Board } from "./board";
import type Column from "./column";
import type Task from "./task";

export type KanbanState = {
  boards: Board[]; // List of all boards
  currentBoardId: string | null; // ID of the currently selected board

  // Getters
  getCurrentBoard: () => Board | null;

  // Setters
  setCurrentBoardId: (boardId: string | null) => void;

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
  moveColumn?: (
    boardId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
  deleteColumn: (boardId: string, columnId: string) => void;

  addTask: (boardId: string, columnId: string, task: Task) => void;
  updateTask: (
    boardId: string,
    columnId: string,
    taskId: string,
    updateFn: (task: Task) => Task,
  ) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
  ) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
};
