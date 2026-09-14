import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Flag,
  ListTodo,
} from "lucide-react";
import { getWorkspaceTasksOverviewPageAction } from "@/actions/task";
import { Badge } from "@/components/ui/badge";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import type { TasksFilter } from "@/lib/types";
import TaskDueDate from "../components/task/task-due-date";
import getBadgeStyle from "../utils/get-badge-style";

type SearchParams = Promise<{ attention?: string; page?: string }>;

const filters: { value: TasksFilter; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "needs-attention", label: "Needs attention" },
  { value: "overdue", label: "Overdue" },
  { value: "high-priority", label: "High priority" },
];
const filterValues = new Set<TasksFilter>(filters.map(({ value }) => value));

function tasksHref(filter: TasksFilter, page = 1) {
  const attention = filter === "all" ? "" : `attention=${filter}&`;
  return `/dashboard/tasks?${attention}page=${page}`;
}

function paginationItems(currentPage: number, totalPages: number) {
  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const visiblePages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return visiblePages.flatMap<number | string>((page, index) => {
    const previousPage = visiblePages[index - 1];
    return previousPage && page - previousPage > 1
      ? [`ellipsis-${previousPage}`, page]
      : [page];
  });
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
  const pageItems = paginationItems(page, totalPages);

  return (
    <main className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="mb-6 flex shrink-0 items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
            Your workspace
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review work across all of your boards.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground shrink-0 text-sm transition-colors"
        >
          Back to dashboard
        </Link>
      </div>

      <nav
        aria-label="Filter tasks"
        className="mb-6 flex shrink-0 flex-wrap gap-2"
      >
        {filters.map(({ value, label }) => (
          <Link
            key={value}
            href={tasksHref(value)}
            aria-current={filter === value ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${filter === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {totalCount} {totalCount === 1 ? "task" : "tasks"}
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
            Try another attention filter.
          </p>
        </div>
      ) : (
        <div className="border-border/80 bg-background/80 divide-border/80 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border shadow-sm">
          {items.map((task) => {
            const isOverdue = task.attentionReason === "overdue";
            const AttentionIcon = isOverdue
              ? CircleAlert
              : task.attentionReason === "high-priority"
                ? Flag
                : ListTodo;
            const iconStyle = isOverdue
              ? "bg-destructive/10 text-destructive"
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

      {totalPages > 1 && (
        <nav
          aria-label="Tasks pagination"
          className="mt-5 flex shrink-0 items-center justify-center gap-1"
        >
          <Link
            href={tasksHref(filter, page - 1)}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={`mr-1 flex size-8 items-center justify-center rounded-md ${page <= 1 ? "text-muted-foreground/40 pointer-events-none" : "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"}`}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Link>
          {pageItems.map((item) =>
            typeof item === "number" ? (
              <Link
                key={item}
                href={tasksHref(filter, item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${item === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {item}
              </Link>
            ) : (
              <span
                key={item}
                aria-hidden="true"
                className="text-muted-foreground flex size-8 items-center justify-center text-sm"
              >
                …
              </span>
            ),
          )}
          <Link
            href={tasksHref(filter, page + 1)}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={`ml-1 flex size-8 items-center justify-center rounded-md ${page >= totalPages ? "text-muted-foreground/40 pointer-events-none" : "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"}`}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Link>
        </nav>
      )}
    </main>
  );
}

export const metadata: Metadata = {
  title: "Tasks",
  description: "Browse and review tasks across your KanbanFlow workspace.",
};
