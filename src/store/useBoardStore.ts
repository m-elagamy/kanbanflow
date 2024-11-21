import { create } from "zustand";

type Task = {
  id: string;
  columnId: string;
  title: string;
  description: string | undefined;
  priority: string;
  tags: string[];
};

type Column = {
  id: string;
  title: string;
  tasks?: Task[];
};

type BoardState = {
  columns: Column[];
  addTask: (task: Task) => void;
  addColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;
};

const useBoardStore = create<BoardState>((set) => ({
  columns: [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "item1",
          columnId: "todo",
          title: "Design homepage",
          description: "Create initial wireframes",
          tags: ["design"],
          priority: "high",
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        {
          id: "item2",
          columnId: "inprogress",
          title: "Build homepage",
          description: "Implement responsive design",
          tags: ["development"],
          priority: "medium",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "item3",
          columnId: "done",
          title: "Deploy to production",
          description: "Deploy to production server",
          tags: ["deployment"],
          priority: "low",
        },
      ],
    },
  ],
  addTask: (task) =>
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === task.columnId
          ? { ...column, tasks: [...(column.tasks || []), task] }
          : column,
      ),
    })),
  addColumn: (column) =>
    set((state) => ({
      columns: [...state.columns, column],
    })),
  deleteColumn: (columnId) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== columnId),
    })),
}));

export default useBoardStore;
