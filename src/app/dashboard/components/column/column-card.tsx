import { useShallow } from "zustand/react/shallow";
import { useDroppable } from "@dnd-kit/core";
import { Column } from "@prisma/client";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Card, CardContent } from "@/components/ui/card";
import { useKanbanStore } from "@/stores/kanban";

import ColumnHeader from "./column-header";
import NoTasksMessage from "../task/no-tasks-message";
import TaskCard from "../task/task-card";

type ColumnCardProps = {
  column: Column;
  boardSlug: string;
};

const ColumnCard = ({ column, boardSlug }: ColumnCardProps) => {
  const tasks = useKanbanStore(
    useShallow((state) => state.getFilteredTasks(boardSlug, column.id)),
  );

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <Card
      className={`relative max-h-[500px] w-72 shrink-0 snap-start overflow-y-auto transition-all duration-300 md:w-80 ${
        isOver
          ? "before:absolute before:inset-0 before:animate-pulse before:bg-gradient-to-b before:from-blue-500/5 before:to-transparent before:opacity-100"
          : "border-border before:opacity-0"
      }`}
      ref={setNodeRef}
    >
      <ColumnHeader
        column={column}
        tasksCount={tasks.length}
        boardSlug={boardSlug}
      />
      <CardContent className="flex-grow space-y-2 overflow-y-auto p-3">
        {tasks?.length === 0 ? (
          <NoTasksMessage columnId={column.id} />
        ) : (
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {tasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                boardSlug={boardSlug}
              />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
};

export default ColumnCard;
