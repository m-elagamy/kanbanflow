"use client";

import Link from "next/link";
import {
  CircleCheck,
  CircleAlert,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";
import type { DashboardFocusTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import TaskDueDate from "../task/task-due-date";
import getBadgeStyle from "../../utils/get-badge-style";

export default function DashboardFocus({
  tasks,
}: {
  tasks: DashboardFocusTask[] | null;
}) {
  return (
    <section aria-labelledby="focus-heading" className="space-y-4">
      <div>
        <h2 id="focus-heading" className="text-lg font-semibold">
          Needs attention
        </h2>
        <p className="text-muted-foreground text-sm">
          Overdue work and high-priority tasks across your boards.
        </p>
      </div>

      {tasks === null ? (
        <div
          role="status"
          className="border-border/60 bg-background/80 text-muted-foreground rounded-xl border p-4 text-sm shadow-sm"
        >
          Attention items are temporarily unavailable.
        </div>
      ) : tasks.length === 0 ? (
        <div className="border-border/60 bg-background/80 flex items-center gap-3 rounded-xl border p-4 shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <CircleCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium">You’re all caught up</p>
            <p className="text-muted-foreground text-xs">
              No overdue or high-priority tasks.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-border/60 bg-background/80 divide-border/60 overflow-hidden rounded-xl border shadow-sm">
          {tasks.map((task) => {
            const isOverdue = task.attentionReason === "overdue";
            const AttentionIcon = isOverdue ? CircleAlert : TriangleAlert;

            return (
              <Link
                key={task.id}
                href={`/dashboard/${task.board.slug}?task=${task.id}`}
                className="hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-ring group flex min-w-0 items-center gap-3 border-b p-3 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-inset sm:p-4"
                aria-label={`Open ${task.title} in ${task.board.title}`}
              >
                <span
                  className={`${isOverdue ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"} flex size-9 shrink-0 items-center justify-center rounded-lg`}
                >
                  <AttentionIcon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {task.board.title} · {task.column.status}
                  </p>
                </div>
                <div className="flex shrink-0 items-end gap-2 max-sm:flex-col">
                  {task.dueDate && <TaskDueDate date={task.dueDate} />}
                  <Badge
                    className={`${getBadgeStyle(task.priority)} h-5 px-2 text-[0.625rem] font-medium uppercase`}
                  >
                    {task.priority}
                  </Badge>
                </div>
                <ChevronRight
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
