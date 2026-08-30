"use client";

import { Flag, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ClientTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import formatDate from "@/utils/format-date";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskActions from "./task-actions";
import taskPriorities from "../../data/task-priorities";

type TaskCardProps = {
  task: ClientTask;
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
    data: { type: "task" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isSortableDragging ? "0.5" : "1",
    scale: isSortableDragging ? "0.95" : "1",
  };

  const dueDate = task.dueDate ? formatDate(task.dueDate) : null;

  const priorityOption = taskPriorities.find((p) => p.id === task.priority);
  const PriorityIcon = priorityOption?.icon || taskPriorities[1].icon; // Default to medium

  return (
    <div
      className={`group border-border/70 bg-card/80 dark:bg-card/5 hover:border-border hover:bg-card/95 dark:hover:bg-card/70 relative touch-manipulation rounded-lg border p-4 shadow-md backdrop-blur-md transition-all duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:shadow-lg hover:before:opacity-100 dark:before:from-white/[0.02] ${isDragging ? "border-primary/50 bg-card dark:bg-card/80 ring-primary/20 z-50 scale-105 rotate-2 shadow-2xl ring-2" : ""}`}
      ref={setNodeRef}
      style={style}
    >
      <div className="relative z-10 space-y-3">
        {/* Header: Drag Handle, Priority Badge and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="text-muted-foreground/50 hover:text-muted-foreground -ml-1 touch-none rounded p-0.5 active:cursor-grabbing"
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
              aria-label="Drag to reorder task"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={14} />
            </button>
            <Badge
              className={`${getBadgeStyle(task.priority)} flex h-5 shrink-0 items-center gap-1 px-2 py-0.5 text-[0.625rem] font-medium uppercase`}
            >
              <PriorityIcon size={10} />
              {task.priority}
            </Badge>
          </div>
          {columnId && <TaskActions task={task} columnId={columnId} />}
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h3
            className={`text-foreground flex-1 text-sm font-medium ${task.title.length > 30 ? "line-clamp-2" : ""}`}
            title={task.title}
            dir="auto"
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className="text-muted-foreground line-clamp-2 text-xs"
              dir="auto"
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-3 text-xs">
            <div className="text-muted-foreground flex items-center gap-1">
              <Flag size={12} />
              <span>{dueDate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
