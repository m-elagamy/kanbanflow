"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CornerDownLeft, Plus, Search } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { EmptyState } from "@/components/ui/empty-state";
import EmptyResultsIllustration from "@/components/ui/empty-results-illustration";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import { useModalStore } from "@/stores/modal";
import { useTaskStore } from "@/stores/task";
import { searchTasksAction } from "@/actions/task";
import getBadgeStyle from "../../utils/get-badge-style";
import type { ClientTask, TaskSearchResult } from "@/lib/types";
import TaskModal from "../task/task-modal";

const priorityOrder = { high: 0, medium: 1, low: 2 } as const;

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const matchIndex = text
    .toLocaleLowerCase()
    .indexOf(query.toLocaleLowerCase());
  if (!query || matchIndex < 0) return text;

  const matchEnd = matchIndex + query.length;
  return (
    <>
      {text.slice(0, matchIndex)}
      <mark className="bg-primary/15 text-foreground rounded-sm px-0.5">
        {text.slice(matchIndex, matchEnd)}
      </mark>
      {text.slice(matchEnd)}
    </>
  );
}

function SearchResultItem({
  task,
  query,
  onSelect,
}: {
  task: TaskSearchResult;
  query: string;
  onSelect: (taskId: string) => void;
}) {
  return (
    <CommandItem
      value={task.id}
      onSelect={() => onSelect(task.id)}
      className="flex items-center gap-3 px-3 py-3"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          <HighlightMatch text={task.title} query={query} />
        </p>
        {task.description && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {task.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-muted-foreground max-w-24 truncate text-xs">
          {task.column.status}
        </span>
        <Badge
          className={`${getBadgeStyle(task.priority)} h-5 px-2 text-[0.625rem] font-medium uppercase`}
        >
          {task.priority}
        </Badge>
      </div>
    </CommandItem>
  );
}

export function BoardSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<{
    query: string;
    boardId: string;
    results: TaskSearchResult[];
    error: string | null;
  } | null>(null);
  const [retry, setRetry] = useState(0);
  const [recentTaskIds, setRecentTaskIds] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<ClientTask | null>(null);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");

  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const openModal = useModalStore((state) => state.openModal);
  const columns = useColumnStore((state) =>
    activeBoardId ? state.columnsByBoard[activeBoardId] : undefined,
  );
  const tasks = useTaskStore(useShallow((state) => Object.values(state.tasks)));

  const boardTasks = useMemo(
    () => tasks.filter((task) => columns?.[task.columnId]),
    [columns, tasks],
  );

  const quickAccessTasks = useMemo(() => {
    const taskById = new Map(boardTasks.map((task) => [task.id, task]));
    const recentTasks = recentTaskIds
      .map((taskId) => taskById.get(taskId))
      .filter((task): task is ClientTask => Boolean(task));
    const recentIds = new Set(recentTasks.map((task) => task.id));
    const suggestedTasks = boardTasks
      .filter((task) => !recentIds.has(task.id))
      .sort((a, b) => {
        const priorityDifference =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDifference !== 0) return priorityDifference;
        if (a.dueDate && b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }
        return a.dueDate ? -1 : b.dueDate ? 1 : a.order - b.order;
      });

    return [...recentTasks, ...suggestedTasks].slice(0, 5).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      columnId: task.columnId,
      column: { status: columns?.[task.columnId]?.status ?? "Unknown" },
    }));
  }, [boardTasks, columns, recentTaskIds]);

  const quickAccessHeading = recentTaskIds.some((taskId) =>
    boardTasks.some((task) => task.id === taskId),
  )
    ? "Recent tasks"
    : "Suggested tasks";

  const prepareSearch = useCallback(() => {
    setShortcutLabel(
      /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K",
    );
    if (!activeBoardId) return;
    try {
      const stored = localStorage.getItem(
        `kanbanflow-recent-tasks-${activeBoardId}`,
      );
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      setRecentTaskIds(
        Array.isArray(parsed)
          ? parsed.filter((value): value is string => typeof value === "string")
          : [],
      );
    } catch {
      setRecentTaskIds([]);
    }
  }, [activeBoardId]);

  const openSearch = useCallback(() => {
    prepareSearch();
    setOpen(true);
  }, [prepareSearch]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          openSearch();
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, openSearch]);

  useEffect(() => {
    if (!open || !query.trim() || !activeBoardId) {
      return;
    }
    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        const result = await searchTasksAction(activeBoardId, query);
        if (!cancelled) {
          setSearch({
            query,
            boardId: activeBoardId,
            results: result.success ? (result.fields ?? []) : [],
            error: result.success ? null : "Search failed. Please try again.",
          });
        }
      } catch {
        if (!cancelled) {
          setSearch({
            query,
            boardId: activeBoardId,
            results: [],
            error: "Search failed. Please try again.",
          });
        }
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, activeBoardId, open, retry]);

  const currentSearch =
    search?.query === query && search.boardId === activeBoardId ? search : null;
  const isPending = Boolean(query.trim() && activeBoardId && !currentSearch);
  const visibleResults = currentSearch?.results ?? [];

  const handleSelect = useCallback(
    (taskId: string) => {
      const task = useTaskStore.getState().tasks[taskId];
      if (!task || !activeBoardId) return;

      const nextRecentIds = [
        taskId,
        ...recentTaskIds.filter((id) => id !== taskId),
      ].slice(0, 5);
      setRecentTaskIds(nextRecentIds);
      try {
        localStorage.setItem(
          `kanbanflow-recent-tasks-${activeBoardId}`,
          JSON.stringify(nextRecentIds),
        );
      } catch {
        // Search remains usable when browser storage is unavailable.
      }

      setSelectedTask(task);
      setOpen(false);
      setQuery("");
      setSearch(null);
      setTimeout(() => openModal("task", `search-task-${taskId}`), 0);
    },
    [activeBoardId, openModal, recentTaskIds],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) prepareSearch();
      setOpen(isOpen);
      if (!isOpen) setQuery("");
    },
    [prepareSearch],
  );

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground h-9 min-w-0 justify-start gap-2 pr-2 pl-3 text-sm font-normal sm:w-50 md:w-62.5"
        onClick={openSearch}
      >
        <Search size={14} />
        <span className="min-w-0 flex-1 truncate text-left">
          Search tasks...
        </span>
        <kbd className="bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] select-none md:inline-flex">
          {shortcutLabel}
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 md:p-0 sm:max-w-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search tasks</DialogTitle>
            <DialogDescription>
              Search for tasks by title or description
            </DialogDescription>
          </DialogHeader>
          <Command shouldFilter={false} className="rounded-none">
            <CommandInput
              placeholder="Search by title or description…"
              className="pr-8"
              value={query}
              onValueChange={(value) => {
                setQuery(value);
                setSearch(null);
              }}
            />
            <CommandList>
              {isPending ? (
                <div className="space-y-2 p-3" aria-label="Searching tasks">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-md p-2"
                    >
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                      <Skeleton className="h-5 w-14 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : !query.trim() ? (
                boardTasks.length === 0 ? (
                  <EmptyState
                    size="compact"
                    className="min-h-56 py-6"
                    illustration={<EmptyResultsIllustration />}
                    title="No tasks to search"
                    description="Create a task, then use search to find it quickly."
                    action={
                      activeBoardId ? (
                        <TaskModal
                          mode="create"
                          boardId={activeBoardId}
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setOpen(false)}
                            >
                              <Plus aria-hidden="true" />
                              Add task
                            </Button>
                          }
                        />
                      ) : undefined
                    }
                  />
                ) : (
                  <CommandGroup heading={quickAccessHeading}>
                    {quickAccessTasks.map((task) => (
                      <SearchResultItem
                        key={task.id}
                        task={task}
                        query=""
                        onSelect={handleSelect}
                      />
                    ))}
                  </CommandGroup>
                )
              ) : currentSearch?.error ? (
                <div role="alert" className="py-6 text-center text-sm">
                  <p>{currentSearch.error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch(null);
                      setRetry((value) => value + 1);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : visibleResults.length === 0 ? (
                <EmptyState
                  size="compact"
                  className="min-h-44 py-6"
                  illustration={<EmptyResultsIllustration />}
                  title="No tasks found"
                  description="Try another keyword or clear your search."
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setQuery("");
                        setSearch(null);
                      }}
                    >
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <CommandGroup
                  heading={`${visibleResults.length} result${visibleResults.length !== 1 ? "s" : ""}`}
                >
                  {visibleResults.map((task) => (
                    <SearchResultItem
                      key={task.id}
                      task={task}
                      query={query.trim()}
                      onSelect={handleSelect}
                    />
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <div className="border-border text-muted-foreground flex items-center justify-end gap-4 border-t px-3 py-2 text-[0.6875rem]">
              <span className="flex items-center gap-1">
                <kbd className="font-sans">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="size-3" aria-hidden="true" /> Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-sans">Esc</kbd> Close
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
      {selectedTask && (
        <TaskModal
          mode="edit"
          task={selectedTask}
          columnId={selectedTask.columnId}
          modalId={`search-task-${selectedTask.id}`}
        />
      )}
    </>
  );
}
