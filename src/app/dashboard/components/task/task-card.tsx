import { Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Badge } from "@/components/ui/badge";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskActions from "./task-actions";
import formatDate from "@/utils/format-date";
import { Task } from "@prisma/client";

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
    id: `${columnId}_${task.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      className={`group max-h-[165px] touch-manipulation overflow-y-auto rounded-lg border border-border bg-card p-3 transition-all`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3
            className={`${task.title.length > 20 ? "necessary-ellipsis max-w-[140px] md:max-w-[180px]" : ""} text-sm font-medium md:text-base`}
            title={task.title}
          >
            {task.title}
          </h3>
          <Badge
            className={`${getBadgeStyle(task.priority)} pointer-events-none rounded-full px-2 text-[0.625rem] uppercase tracking-wider`}
          >
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground">{task.description}</p>
        )}
        <div className={`flex items-center justify-end`}>
          <div className="flex flex-col-reverse items-center gap-2">
            <p className="flex items-center justify-center gap-1 text-[0.625rem] text-muted-foreground">
              <Calendar size={12} />
              {formatDate(new Date().toLocaleDateString())}
            </p>
            {columnId && <TaskActions task={task} columnId={columnId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
