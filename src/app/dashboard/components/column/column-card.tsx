import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useShallow } from "zustand/react/shallow";
import { Card, CardContent } from "@/components/ui/card";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import { useTaskStore } from "@/stores/task";
import ColumnHeader from "./column-header";
import NoTasksMessage from "../task/no-tasks-message";
import TaskCard from "../task/task-card";

type ColumnCardProps = {
  column: SimplifiedColumn;
};

const ColumnCard = ({ column }: ColumnCardProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const tasks = useTaskStore(
    useShallow((state) => state.getColumnTasks(column.id)),
  );

  const taskIds = tasks.map((task) => task.id);

  return (
    <Card
      className={`bg-background relative max-h-[500px] w-72 shrink-0 snap-start gap-0 overflow-y-auto p-0 transition-all duration-300 md:w-80 ${
        isOver
          ? "before:absolute before:inset-0 before:animate-pulse before:bg-linear-to-b before:from-blue-500/5 before:to-transparent before:opacity-100"
          : "border-border before:opacity-0"
      }`}
      ref={setNodeRef}
    >
      <ColumnHeader column={column} tasksCount={tasks.length} />
      <CardContent className="grow space-y-2 overflow-y-auto p-3">
        {tasks?.length === 0 ? (
          <NoTasksMessage columnId={column.id} />
        ) : (
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {tasks?.map((task) => (
              <TaskCard key={task.title} task={task} columnId={column.id} />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
};

export default ColumnCard;
