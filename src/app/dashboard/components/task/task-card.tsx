"use client";

import { Clock, Flag } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUser } from "@clerk/nextjs";
import type { Task } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaskProgress } from "@/components/ui/task-progress";
import formatDate from "@/utils/format-date";
import { formatTime } from "@/utils/format-time";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskActions from "./task-actions";
import taskPriorities from "../../data/task-priorities";

type TaskCardProps = {
  task: Task;
  columnId?: string | null;
  isDragging?: boolean;
};

const TaskCard = ({ task, columnId, isDragging = false }: TaskCardProps) => {
  const { user } = useUser();
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

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` ||
      user.emailAddresses[0]?.emailAddress[0].toUpperCase() ||
      "U"
    : "U";

  // Due date (only show if it exists)
  const dueDate = task.dueDate ? formatDate(task.dueDate.toISOString()) : null;

  // Progress, estimated time, and logged time (will be from task once schema is updated)
  // For now, using type assertion to access these optional fields
  const taskWithTime = task as Task & {
    progress?: number;
    estimatedMinutes?: number | null;
    loggedMinutes?: number | null;
  };

  // Placeholder values for UI preview (remove when real data is available)
  const progress = taskWithTime.progress ?? 0;
  const estimatedMinutes = taskWithTime.estimatedMinutes ?? 120; // 2 hours

  // Show progress only if it's greater than 0
  const showProgress = progress > 0;

  // Get the priority icon
  const priorityOption = taskPriorities.find((p) => p.id === task.priority);
  const PriorityIcon = priorityOption?.icon || taskPriorities[1].icon; // Default to medium

  return (
    <div
      className={`group border-border/70 bg-card/80 dark:bg-card/5 hover:border-border hover:bg-card/95 dark:hover:bg-card/70 relative touch-manipulation rounded-lg border p-4 shadow-md backdrop-blur-md transition-all duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:shadow-lg hover:before:opacity-100 dark:before:from-white/[0.02] ${isDragging ? "border-primary/50 bg-card dark:bg-card/80 ring-primary/20 z-50 scale-105 rotate-2 shadow-2xl ring-2" : ""}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="relative z-10 space-y-3">
        {/* Header: Priority Badge and Actions */}
        <div className="flex items-center justify-between">
          <Badge
            className={`${getBadgeStyle(task.priority)} flex h-5 shrink-0 items-center gap-1 px-2 py-0.5 text-[0.625rem] font-medium uppercase`}
          >
            <PriorityIcon size={10} />
            {task.priority}
          </Badge>
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

        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">
                Progress
              </span>
              <span className="text-muted-foreground text-xs font-semibold">
                {progress}%
              </span>
            </div>
            <TaskProgress progress={progress} />
          </div>
        )}

        {/* Time Info */}
        {(dueDate || estimatedMinutes) && (
          <div className="flex items-center gap-3 text-xs">
            {dueDate && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Flag size={12} />
                <span>{dueDate}</span>
              </div>
            )}
            {estimatedMinutes && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Clock size={12} />
                <span>Est: {formatTime(estimatedMinutes)}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer: Avatar */}
        {user && (
          <div className="flex items-center justify-end">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
              <AvatarFallback className="text-[0.625rem]">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
