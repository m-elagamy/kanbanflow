import type Column from "./column";
import type Task from "./task";

type BoardState = {
  columns: Column[];
  addTask: (task: Task) => void;
  addColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;
};

export default BoardState;
