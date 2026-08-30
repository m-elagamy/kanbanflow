import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useShallow } from "zustand/react/shallow";
import { Card, CardContent } from "@/components/ui/card";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import { useTaskStore } from "@/stores/task";
import { useTaskFilterStore } from "@/stores/task-filter";
import ColumnHeader from "./column-header";
import NoTasksMessage from "../task/no-tasks-message";
import NoMatchingTasksMessage from "../task/no-matching-tasks-message";
import TaskCard from "../task/task-card";

type ColumnCardProps = {
  column: SimplifiedColumn;
};

const ColumnCard = ({ column }: ColumnCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isOver,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const tasks = useTaskStore(
    useShallow((state) => state.getColumnTasks(column.id)),
  );
  const priorityFilter = useTaskFilterStore((state) => state.priorityFilter);

  const visibleTasks =
    priorityFilter === "all"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);

  const taskIds = visibleTasks.map((task) => task.id);

  return (
    <Card
      className={`group border-border/70 bg-accent/25 dark:bg-accent/30 hover:border-border hover:bg-accent/70 dark:hover:bg-accent/40 relative max-h-[calc(100dvh-82px)] w-72 shrink-0 snap-start gap-0 overflow-hidden rounded-xl border py-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl md:w-84 ${
        isOver
          ? "ring-primary/20 border-primary/30 bg-primary/5 scale-[1.02] shadow-lg ring-2"
          : ""
      }`}
      ref={setNodeRef}
      style={style}
    >
      {/* Drop zone indicator */}
      {isOver && (
        <div className="from-primary/10 absolute inset-0 animate-pulse rounded-xl bg-gradient-to-b to-transparent" />
      )}

      <ColumnHeader
        column={column}
        tasksCount={tasks.length}
        dragHandleProps={{ attributes, listeners }}
      />

      <CardContent className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-1 space-y-3 overflow-y-auto p-4 pt-3">
        {tasks.length === 0 ? (
          <NoTasksMessage columnId={column.id} />
        ) : visibleTasks.length === 0 ? (
          <NoMatchingTasksMessage />
        ) : (
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <TaskCard key={task.id} task={task} columnId={column.id} />
              ))}
            </div>
          </SortableContext>
        )}
      </CardContent>

      <div className="from-background/50 pointer-events-none absolute right-0 bottom-0 left-0 h-4 bg-gradient-to-t to-transparent" />
    </Card>
  );
};

export default ColumnCard;
