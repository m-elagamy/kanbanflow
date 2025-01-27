"use client";

import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
import type { Task } from "@prisma/client";
import { Column } from "@prisma/client";

type ColumnsWrapperProps = {
  columns: (Column & { tasks: Task[] })[];
  boardId: string;
};

const ColumnsWrapper = ({ columns, boardId }: ColumnsWrapperProps) => {
  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      {columns?.map((column) => (
        <ColumnCard key={column.id} column={column} tasks={column.tasks} />
      ))}
      <ColumnModal boardId={boardId} />
    </div>
  );
};

export default ColumnsWrapper;
