import { create } from "zustand";
import type { Priority } from "@prisma/client";

export type PriorityFilterValue = Priority | "all";

type TaskFilterState = {
  priorityFilter: PriorityFilterValue;
  setPriorityFilter: (value: PriorityFilterValue) => void;
};

export const useTaskFilterStore = create<TaskFilterState>((set) => ({
  priorityFilter: "all",
  setPriorityFilter: (value) => set({ priorityFilter: value }),
}));
