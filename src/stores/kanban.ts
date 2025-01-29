import { create } from "zustand";
import { Column, Task } from "@prisma/client";

type KanbanState = {
  columns: (Column & { tasks: Task[] })[];
  setColumns: (columns: (Column & { tasks: Task[] })[]) => void;
};

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: [],
  setColumns: (columns) => set(() => ({ columns })),
}));
