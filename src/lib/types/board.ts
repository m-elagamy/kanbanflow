import type Column from "./column";

export type Board = {
  id: string;
  title: string;
  description?: string;
  columns: Column[];
};
