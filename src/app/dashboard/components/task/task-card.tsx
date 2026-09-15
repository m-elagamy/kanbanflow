"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ClientTask } from "@/lib/types";
import TaskActions from "./task-actions";
import useLoadingStore from "@/stores/loading";
import { useTaskFilterStore } from "@/stores/task-filter";
import { useModalStore } from "@/stores/modal";
import PriorityIndicator from "./priority-indicator";
import TaskColumnAge from "./task-column-age";

type TaskCardProps = {
  task: ClientTask;
  columnId?: string | null;
  isDragging?: boolean;
  isFocused?: boolean;
  showColumnAge?: boolean;
};

const TaskCard = ({
  task,
  columnId,
  isDragging = false,
  isFocused = false,
  showColumnAge = true,
}: TaskCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [showFocus, setShowFocus] = useState(isFocused);
  const isUpdating = useLoadingStore((state) =>
    state.isLoading("task", "updating"),
  );
  const priorityFilter = useTaskFilterStore((state) => state.priorityFilter);
  const openModal = useModalStore((state) => state.openModal);
  const modalId = `task-${task.id}`;

  const openTask = () => {
    if (!columnId || isDragging) return;
    openModal("task", modalId);
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
    isOver,
  } = useSortable({
    id: task.id,
    disabled: isUpdating || priorityFilter !== "all",
    data: { type: "task" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isSortableDragging ? "0.5" : "1",
    scale: isSortableDragging ? "0.95" : "1",
  };

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

    const timeout = window.setTimeout(() => setShowFocus(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [isFocused]);

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      openTask();
      return;
    }

    listeners?.onKeyDown?.(event);
  };

  return (
    <div
      className={`group/task border-border/80 bg-card hover:border-border focus-visible:ring-ring relative touch-manipulation rounded-lg border p-3 shadow-xs transition-[border-color,box-shadow,transform] duration-200 outline-none hover:shadow-sm focus-visible:ring-2 ${isDragging ? "border-primary/50 bg-card ring-primary/20 z-50 scale-[1.02] cursor-grabbing shadow-xl ring-2" : priorityFilter === "all" ? "cursor-grab" : "cursor-pointer"} ${isOver && !isSortableDragging ? "after:bg-primary after:absolute after:-top-2 after:right-1 after:left-1 after:h-0.5 after:rounded-full" : ""} ${showFocus ? "border-primary/60 bg-primary/5 ring-primary/30 shadow-primary/10 dark:bg-primary/10 shadow-lg ring-2" : ""}`}
      ref={setCardRef}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={columnId ? 0 : -1}
      aria-label={columnId ? `${task.title}. Press Enter to open.` : undefined}
      onClick={openTask}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative z-10 space-y-2.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 space-y-1">
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
          {columnId && (
            <div
              className="shrink-0 md:opacity-0 md:transition-opacity md:group-focus-within/task:opacity-100 md:group-hover/task:opacity-100"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <TaskActions task={task} columnId={columnId} />
            </div>
          )}
        </div>

        <div className="text-muted-foreground flex min-h-5 items-center justify-between gap-3 text-xs">
          {showColumnAge && (
            <TaskColumnAge columnEnteredAt={task.columnEnteredAt} />
          )}
          <PriorityIndicator
            priority={task.priority}
            showLabel={false}
            className="ml-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
