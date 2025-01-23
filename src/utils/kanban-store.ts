import type { Board } from "@/lib/types/board";
import type Column from "@/lib/types/column";
import { Task } from "@/lib/types/task";

const findBoard = (boards: Board[], boardId: string | null) =>
  boards.find((b: Board) => b.id === boardId);

const findColumn = (board: Board, columnId: string) =>
  board.columns.find((col: Column) => col.id === columnId);

const findTask = (column: Column, taskId: string) =>
  column.tasks.find((task: Task) => task.id === taskId);

export { findBoard, findColumn, findTask };
