"use client";

import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { getTaskDueDate } from "@/utils/task-due-date";

export default function TaskDueDate({ date }: { date: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const timeout = setTimeout(update, 0);
    const interval = setInterval(update, 60_000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const due = now ? getTaskDueDate(date, now) : null;
  return (
    <div
      className={`flex items-center gap-1 text-xs ${due?.overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
    >
      <Flag size={12} aria-hidden="true" />
      <time dateTime={date.slice(0, 10)}>
        {due?.label ?? date.slice(0, 10)}
      </time>
    </div>
  );
}
