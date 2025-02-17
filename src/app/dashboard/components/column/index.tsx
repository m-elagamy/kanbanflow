"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Task, Column } from "@prisma/client";

import DndProvider from "@/providers/dnd-provider";
import { useColumnStore } from "@/stores/column";
import { useTaskStore } from "@/stores/task";
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

  const { columns, setColumns } = useColumnStore(
    useShallow((state) => ({
      columns: state.columns,
      setColumns: state.setColumns,
    })),
  );
  const setTasks = useTaskStore(useShallow((state) => state.setTasks));

  useEffect(() => {
    if (!initialColumns) return;

    const columnsWithoutTasks: Column[] = [];

    initialColumns.forEach(({ id, tasks, ...rest }) => {
      columnsWithoutTasks.push({ id, ...rest });
      setTasks(id, tasks);
    });

    setColumns(columnsWithoutTasks);
    setIsLoading(false);
  }, [initialColumns, setColumns, setTasks]);

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      {isLoading ? (
        <ColumnSkeleton
          columnsNumber={initialColumns.length}
          tasksPerColumn={initialColumns.map((column) => column.tasks.length)}
        />
      ) : (
        <DndProvider boardSlug={boardSlug}>
          {Object.values(columns)?.map((column) => (
            <ColumnCard key={column.id} column={column} boardSlug={boardSlug} />
          ))}
        </DndProvider>
      )}
      <ColumnModal boardId={boardId} />
    </div>
  );
};

export default ColumnsWrapper;
