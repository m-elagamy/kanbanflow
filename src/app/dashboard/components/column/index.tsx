"use client";

import { useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";
import { Task, Column } from "@prisma/client";

import DndProvider from "@/providers/dnd-provider";
import { useKanbanStore } from "@/stores/kanban";

import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
import ColumnSkeleton from "./column-skeleton";

type ColumnsWrapperProps = {
  columns: (Column & { tasks: Task[] })[];
  boardId: string;
  boardSlug: string;
};

const ColumnsWrapper = ({
  columns: initialColumns,
  boardId,
  boardSlug,
}: ColumnsWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const columns = useKanbanStore((state) => state.columns);
  const setColumns = useKanbanStore(useShallow((state) => state.setColumns));

  useEffect(() => {
    if (initialColumns) {
      setColumns(initialColumns);
      setIsLoading(false);
    }
  }, [initialColumns, setColumns]);

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      {isLoading ? (
        <ColumnSkeleton
          columnsNumber={initialColumns.length}
          tasksPerColumn={initialColumns.map((column) => column.tasks.length)}
        />
      ) : (
        <DndProvider boardSlug={boardSlug}>
          {columns?.map((column) => (
            <ColumnCard key={column.id} column={column} boardSlug={boardSlug} />
          ))}
        </DndProvider>
      )}
      <ColumnModal boardId={boardId} boardSlug={boardSlug} />
    </div>
  );
};

export default ColumnsWrapper;
