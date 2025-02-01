"use client";

import { useEffect } from "react";
import DndProvider from "@/providers/dnd-provider";
import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
import type { Task } from "@prisma/client";
import { Column } from "@prisma/client";
import { useKanbanStore } from "@/stores/kanban";
import { useShallow } from "zustand/react/shallow";

type ColumnsWrapperProps = {
  columns: (Column & { tasks: Task[] })[];
  boardId: string;
  boardTitle: string;
};

const ColumnsWrapper = ({
  columns: initialColumns,
  boardId,
  boardTitle,
}: ColumnsWrapperProps) => {
  const columns = useKanbanStore((state) => state.columns);
  const setColumns = useKanbanStore(useShallow((state) => state.setColumns));

  useEffect(() => {
    if (initialColumns) {
      setColumns(initialColumns);
    }
  }, [initialColumns, setColumns]);

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      <DndProvider>
        {columns?.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            tasks={column.tasks}
            boardTitle={boardTitle}
          />
        ))}
      </DndProvider>
      <ColumnModal boardId={boardId} boardTitle={boardTitle} />
    </div>
  );
};

export default ColumnsWrapper;
