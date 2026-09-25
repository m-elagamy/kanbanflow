import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  ListTodo,
} from "lucide-react";
import { getWorkspaceTasksOverviewPageAction } from "@/actions/task";
import { TASKS_PAGE_SIZE, TERMINAL_COLUMN_STATUSES } from "@/lib/constants";
import type { TasksFilter } from "@/lib/types";
import Pagination from "../components/pagination";
import PriorityIndicator from "../components/task/priority-indicator";
import TaskColumnAge from "../components/task/task-column-age";

type SearchParams = Promise<{ attention?: string; page?: string }>;

const filters: { value: TasksFilter; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "open", label: "Open tasks" },
  { value: "needs-attention", label: "Needs attention" },
  { value: "stale", label: "Stale" },
  { value: "high-priority", label: "High priority" },
];
const filterValues = new Set<TasksFilter>(filters.map(({ value }) => value));

function tasksHref(filter: TasksFilter, page = 1) {
  const attention = filter === "all" ? "" : `attention=${filter}&`;
  return `/dashboard/tasks?${attention}page=${page}`;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filter = (params.attention ?? "all") as TasksFilter;
  const page = Number(params.page ?? "1");

  if (
    !filterValues.has(filter) ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 2147483647 / TASKS_PAGE_SIZE
  ) {
    redirect(tasksHref("all"));
  }

  const result = await getWorkspaceTasksOverviewPageAction(filter, page);
  if (!result.success || !result.fields)
    throw new Error("Failed to load tasks. Please try again.");

  const { items, totalCount } = result.fields;
  const totalPages = Math.max(1, Math.ceil(totalCount / TASKS_PAGE_SIZE));
  if (page > totalPages) redirect(tasksHref(filter, totalPages));
  const activeFilter = filters.find(({ value }) => value === filter)!;

  return (
    <main className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">
      <div className="mb-4 shrink-0 sm:mb-6">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
            Your workspace
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review work across all of your boards.
          </p>
        </div>
      </div>

      <nav
        aria-label="Filter tasks"
        className="scrollbar-hide mb-4 flex shrink-0 gap-2 overflow-x-auto sm:mb-6"
      >
        {filters.map(({ value, label }) => (
          <Link
            key={value}
            href={tasksHref(value)}
            aria-current={filter === value ? "page" : undefined}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${filter === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {activeFilter.label} · {totalCount}{" "}
          {totalCount === 1 ? "task" : "tasks"}
        </p>
        {totalPages > 1 && (
          <p className="text-muted-foreground text-xs">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border-border/80 bg-background/80 flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border px-4 py-12 text-center shadow-sm">
          <p className="text-sm font-medium">No matching tasks</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {filter === "all"
              ? "Create a task on one of your boards to see it here."
              : "Try another filter or return when your workflow changes."}
          </p>
        </div>
      ) : (
        <div className="border-border/80 bg-background/80 divide-border/80 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border shadow-sm">
          {items.map((task) => {
            const isStale = task.attentionReason === "stale";
            const AttentionIcon = isStale
              ? Clock3
              : task.attentionReason === "high-priority"
                ? Flag
                : ListTodo;
            const iconStyle = isStale
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : task.attentionReason === "high-priority"
                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                : "bg-muted text-muted-foreground";
            return (
              <Link
                key={task.id}
                href={`/dashboard/${task.board.slug}?focus=${task.id}`}
                className="hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-ring group flex min-w-0 items-center gap-3 border-b p-3 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-inset sm:p-4"
                aria-label={`Focus ${task.title} in ${task.board.title}`}
              >
                <span
                  className={`${iconStyle} flex size-9 shrink-0 items-center justify-center rounded-lg`}
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
                  {!TERMINAL_COLUMN_STATUSES.includes(task.column.status) && (
                    <TaskColumnAge
                      columnEnteredAt={task.columnEnteredAt}
                      compact={false}
                    />
                  )}
                  <PriorityIndicator priority={task.priority} />
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

      <Pagination
        ariaLabel="Tasks pagination"
        currentPage={page}
        totalPages={totalPages}
        hrefForPage={(pageNumber) => tasksHref(filter, pageNumber)}
      />
    </main>
  );
}

export const metadata: Metadata = {
  title: "Tasks",
  description: "Browse and review tasks across your Kanbamy workspace.",
};
