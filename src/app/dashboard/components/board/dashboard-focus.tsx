import Link from "next/link";
import { Clock3, CircleCheck, ChevronRight, Flag } from "lucide-react";
import type { DashboardFocusPreview } from "@/lib/types";
import PriorityIndicator from "../task/priority-indicator";
import TaskColumnAge from "../task/task-column-age";

export default function DashboardFocus({
  tasks,
}: {
  tasks: DashboardFocusPreview | null;
}) {
  if (tasks?.items.length === 0) {
    return (
      <section aria-labelledby="focus-heading" className="space-y-4">
        <div>
          <h2 id="focus-heading" className="text-lg font-semibold">
            Needs attention
          </h2>
          <p className="text-muted-foreground text-sm">
            Stale work and high-priority tasks across your boards.
          </p>
        </div>
        <div className="border-border/80 bg-background/80 flex items-center gap-3 rounded-xl border p-4 shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <CircleCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium">You’re all caught up</p>
            <p className="text-muted-foreground text-xs">
              No stale or high-priority tasks.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="focus-heading" className="space-y-4">
      <div>
        <h2 id="focus-heading" className="text-lg font-semibold">
          Needs attention
        </h2>
        <p className="text-muted-foreground text-sm">
          Stale work and high-priority tasks across your boards.
        </p>
      </div>

      {tasks === null ? (
        <div
          role="status"
          className="border-border/80 bg-background/80 text-muted-foreground rounded-xl border p-4 text-sm shadow-sm"
        >
          Attention items are temporarily unavailable.
        </div>
      ) : (
        <div className="border-border/80 bg-background/80 divide-border/80 overflow-hidden rounded-xl border shadow-sm">
          {tasks.items.map((task) => {
            const isStale = task.attentionReason === "stale";
            const AttentionIcon = isStale ? Clock3 : Flag;
            return (
              <Link
                key={task.id}
                href={`/dashboard/${task.board.slug}?focus=${task.id}`}
                className="hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-ring group flex min-w-0 items-center gap-3 border-b p-3 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-inset sm:p-4"
                aria-label={`Focus ${task.title} in ${task.board.title}`}
              >
                <span
                  className={`${isStale ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"} flex size-9 shrink-0 items-center justify-center rounded-lg`}
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
                  <TaskColumnAge
                    columnEnteredAt={task.columnEnteredAt}
                    compact={false}
                  />
                  <PriorityIndicator priority={task.priority} />
                </div>
                <ChevronRight
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
          {tasks.hasMore && (
            <div className="bg-muted/20 flex justify-center px-4 py-2.5">
              <Link
                href="/dashboard/tasks?attention=needs-attention&page=1"
                className="text-foreground/70 hover:text-foreground group flex items-center gap-1 text-sm font-medium transition-colors"
              >
                View all
                <ChevronRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
