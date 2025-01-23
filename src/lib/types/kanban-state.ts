import type { Board } from "./board";
import type Column from "./column";
import { Task } from "./task";

export type KanbanState = {
  boards: Board[]; // List of all boards
  activeBoardId: string | null; // ID of the currently selected board
  activeTask: Task | null;

  // Getters
  getCurrentBoard: () => Board | null;
  getColumns: () => Column[];
  getColumnTasks: (columnId: string) => Task[];
  getTaskById: (columnId: string, taskId: string) => Task | null;

  // Setters
  setActiveBoard: (boardId: string | null) => void;
  setActiveTask: (task: Task | null) => void;

  // Actions
  addBoard: (board: Board) => void;
  updateBoard: (
    boardId: string | null,
    updateFn: (board: Board) => Board,
  ) => void;
  deleteBoard: (boardId: string | null) => void;

  addColumn: (boardId: string | null, column: Column) => void;
  updateColumn: (
    boardId: string | null,
    columnId: string,
    updateFn: (col: Column) => Column,
  ) => void;
  moveColumn?: (
    boardId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
  deleteColumn: (boardId: string | null, columnId: string) => void;

  addTask: (boardId: string | null, columnId: string, task: Task) => void;
  updateTask: (
    boardId: string | null,
    columnId: string,
    taskId: string,
    updateFn: (task: Task) => Task,
  ) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number,
  ) => void;
  deleteTask: (
    boardId: string | null,
    columnId: string,
    taskId: string,
  ) => void;
};
