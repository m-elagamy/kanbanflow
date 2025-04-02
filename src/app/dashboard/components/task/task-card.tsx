import { Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import formatDate from "@/utils/format-date";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskActions from "./task-actions";
import accentStyles from "../../utils/accent-styles";

type TaskCardProps = {
  task: Task;
  columnId?: string | null;
  isDragging?: boolean;
};

const TaskCard = ({ task, columnId, isDragging = false }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isSortableDragging ? "0.5" : "1",
    scale: isSortableDragging ? "0.95" : "1",
  };

  return (
    <div
      className={`group border-border bg-card/20 max-h-[165px] touch-manipulation overflow-y-auto rounded-lg border p-3 duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] ${isDragging ? "scale-105 rotate-2 shadow-xl" : "shadow-xs hover:shadow-md"}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <h3
            className={`${task.title.length > 25 ? "necessary-ellipsis max-w-[150px] md:max-w-[220px]" : ""}`}
            title={task.title}
            dir="auto"
          >
            {task.title}
          </h3>
          <Badge
            className={`${getBadgeStyle(task.priority)} h-5 p-2 text-[0.525rem] uppercase`}
          >
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-muted-foreground text-xs" dir="auto">
            {task.description}
          </p>
        )}
        <div className={`flex items-center justify-end`}>
          <div className="flex flex-col-reverse items-center gap-2">
            <p className="text-muted-foreground flex items-center justify-center gap-1 text-[0.625rem]">
              <Calendar size={12} />
              {formatDate(new Date().toLocaleDateString())}
            </p>
            {columnId && <TaskActions task={task} columnId={columnId} />}
          </div>
        </div>
      </div>
      {!isDragging && (
        <div
          className={`group-hover:w-full ${accentStyles({ priority: task.priority })}`}
        />
      )}
    </div>
  );
};

export default TaskCard;
