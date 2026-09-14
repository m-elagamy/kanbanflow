"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ClientTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import TaskDueDate from "./task-due-date";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskActions from "./task-actions";
import taskPriorities from "../../data/task-priorities";
import useLoadingStore from "@/stores/loading";

type TaskCardProps = {
  task: ClientTask;
  columnId?: string | null;
  isDragging?: boolean;
  isFocused?: boolean;
};

const TaskCard = ({
  task,
  columnId,
  isDragging = false,
  isFocused = false,
}: TaskCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [showFocus, setShowFocus] = useState(isFocused);
  const isUpdating = useLoadingStore((state) =>
    state.isLoading("task", "updating", task.id),
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    disabled: isUpdating,
    data: { type: "task" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isSortableDragging ? "0.5" : "1",
    scale: isSortableDragging ? "0.95" : "1",
  };

  const priorityOption = taskPriorities.find((p) => p.id === task.priority);
  const PriorityIcon = priorityOption?.icon || taskPriorities[1].icon; // Default to medium

  const setCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef],
  );

  useEffect(() => {
    if (!isFocused || !cardRef.current) return;

    setShowFocus(true);
    cardRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    const timeout = window.setTimeout(() => setShowFocus(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [isFocused]);

  return (
    <div
      className={`group border-border/70 bg-card/80 dark:bg-card/5 hover:border-border hover:bg-card/95 dark:hover:bg-card/70 relative touch-manipulation rounded-lg border p-4 shadow-md backdrop-blur-md transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:shadow-lg hover:before:opacity-100 dark:before:from-white/[0.02] ${isDragging ? "border-primary/50 bg-card dark:bg-card/80 ring-primary/20 z-50 scale-105 rotate-2 shadow-2xl ring-2" : ""} ${showFocus ? "border-primary/60 bg-primary/5 ring-primary/30 shadow-primary/10 ring-2 shadow-lg dark:bg-primary/10" : ""}`}
      ref={setCardRef}
      style={style}
    >
      <div className="relative z-10 space-y-3">
        {/* Header: Drag Handle, Priority Badge and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isUpdating}
              className="text-muted-foreground/50 hover:text-muted-foreground focus-visible:ring-ring -ml-2 flex size-7 touch-none items-center justify-center rounded outline-none focus-visible:ring-2 active:cursor-grabbing"
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
              <PriorityIcon size={10} aria-hidden="true" />
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
        {task.dueDate && <TaskDueDate date={task.dueDate} />}
      </div>
    </div>
  );
};

export default TaskCard;
