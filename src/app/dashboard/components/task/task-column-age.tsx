"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Clock3 } from "lucide-react";
import { STALE_TASK_DAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

type TaskColumnAgeProps = {
  columnEnteredAt: string;
  compact?: boolean;
  className?: string;
  showIcon?: boolean;
};

export default function TaskColumnAge({
  columnEnteredAt,
  compact = true,
  className,
  showIcon = true,
}: TaskColumnAgeProps) {
  const getDays = useCallback(() => {
    const enteredAt = new Date(columnEnteredAt).getTime();
    if (Number.isNaN(enteredAt)) return null;
    return Math.max(0, Math.floor((Date.now() - enteredAt) / DAY_IN_MS));
  }, [columnEnteredAt]);
  const days = useSyncExternalStore(
    () => () => undefined,
    getDays,
    () => null,
  );

  if (days === null || days < STALE_TASK_DAYS) return null;

  const label = `${days} ${days === 1 ? "day" : "days"} in column`;

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-amber-600 dark:text-amber-400",
        className,
      )}
      title={label}
      aria-label={label}
    >
      {showIcon && <Clock3 className="size-3.5" aria-hidden="true" />}
      <span>{compact ? `${days}d` : label}</span>
    </span>
  );
}
