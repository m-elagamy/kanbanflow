"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Plus, Search } from "lucide-react";
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
import {
  getBoardTasksPageAction,
  getWorkspaceTasksPageAction,
} from "@/actions/task";
import useBoardStore from "@/stores/board";
import { useModalStore } from "@/stores/modal";
import type { ClientTask, TaskSearchPage, TaskSearchResult } from "@/lib/types";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskModal from "../task/task-modal";

type SearchState = TaskSearchPage & { key: string; error: string | null };

function SearchResultItem({
  task,
  onSelect,
  showBoard,
}: {
  task: TaskSearchResult;
  onSelect: (task: TaskSearchResult) => void;
  showBoard: boolean;
}) {
  return (
    <CommandItem
      value={task.id}
      onSelect={() => onSelect(task)}
      className="flex items-center gap-3 px-3 py-3"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.title}</p>
        {task.description && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {task.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 max-sm:flex-col max-sm:items-end max-sm:gap-1">
        <span className="text-muted-foreground max-w-24 truncate text-xs">
          {showBoard ? task.board.title : task.column.status}
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

export function BoardSearch({
  scope = "board",
}: {
  scope?: "board" | "workspace";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState | null>(null);
  const [retry, setRetry] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ClientTask | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const openModal = useModalStore((state) => state.openModal);
  const boardId = scope === "board" ? activeBoardId : null;
  const canSearch = scope === "workspace" || Boolean(boardId);
  const normalizedQuery = query.trim();
  const searchKey = `${scope}:${boardId ?? "all"}:${normalizedQuery}`;
  const currentSearch = search?.key === searchKey ? search : null;
  const nextCursor = currentSearch?.nextCursor ?? null;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!open || !canSearch) return;

    let cancelled = false;
    const timeout = setTimeout(
      async () => {
        try {
          const result =
            scope === "workspace"
              ? await getWorkspaceTasksPageAction(
                  normalizedQuery,
                  null,
                  TASKS_PAGE_SIZE,
                )
              : await getBoardTasksPageAction(
                  boardId!,
                  normalizedQuery,
                  null,
                  TASKS_PAGE_SIZE,
                );
          if (cancelled) return;

          setSearch({
            key: searchKey,
            items: result.success ? (result.fields?.items ?? []) : [],
            nextCursor: result.success
              ? (result.fields?.nextCursor ?? null)
              : null,
            error: result.success ? null : result.message,
          });
        } catch {
          if (!cancelled) {
            setSearch({
              key: searchKey,
              items: [],
              nextCursor: null,
              error: "Search failed. Please try again.",
            });
          }
        }
      },
      normalizedQuery ? 250 : 0,
    );

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [boardId, canSearch, normalizedQuery, open, retry, scope, searchKey]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
      setSearch(null);
    }
  }, []);

  const handleSelect = useCallback(
    (task: TaskSearchResult) => {
      const clientTask: ClientTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        order: task.order,
        columnId: task.columnId,
        dueDate: task.dueDate,
      };
      setSelectedTask(clientTask);
      setOpen(false);
      setQuery("");
      setSearch(null);

      if (scope === "workspace") {
        router.push(`/dashboard/${task.board.slug}?task=${task.id}`);
      } else {
        setTimeout(() => openModal("task", `search-task-${task.id}`), 0);
      }
    },
    [openModal, router, scope],
  );

  const handleLoadMore = useCallback(async () => {
    if (!canSearch || !nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    const requestedKey = searchKey;
    try {
      const result =
        scope === "workspace"
          ? await getWorkspaceTasksPageAction(
              normalizedQuery,
              nextCursor,
              TASKS_PAGE_SIZE,
            )
          : await getBoardTasksPageAction(
              boardId!,
              normalizedQuery,
              nextCursor,
              TASKS_PAGE_SIZE,
            );
      if (!result.success || !result.fields) {
        setSearch((current) =>
          current?.key === requestedKey
            ? { ...current, error: result.message }
            : current,
        );
        return;
      }
      const page = result.fields;

      setSearch((current) => {
        if (current?.key !== requestedKey) return current;
        const existingIds = new Set(current.items.map((task) => task.id));
        return {
          ...current,
          items: [
            ...current.items,
            ...page.items.filter((task) => !existingIds.has(task.id)),
          ],
          nextCursor: page.nextCursor,
          error: null,
        };
      });
    } catch {
      setSearch((current) =>
        current?.key === requestedKey
          ? { ...current, error: "Search failed. Please try again." }
          : current,
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    boardId,
    canSearch,
    isLoadingMore,
    nextCursor,
    normalizedQuery,
    scope,
    searchKey,
  ]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !nextCursor || isLoadingMore || currentSearch?.error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void handleLoadMore();
      },
      {
        root: target.closest("[cmdk-list]"),
        rootMargin: "80px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [currentSearch?.error, handleLoadMore, isLoadingMore, nextCursor]);

  const isPending = Boolean(open && canSearch && !currentSearch);
  const results = currentSearch?.items ?? [];

  return (
    <>
      <Button
        variant="outline"
        className={`text-muted-foreground h-10 min-w-0 justify-start gap-2 pr-2 pl-3 text-sm font-normal ${scope === "workspace" ? "w-full" : "sm:w-50 md:w-62.5"}`}
        onClick={() => setOpen(true)}
      >
        <Search size={14} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">
          {scope === "workspace"
            ? "Search tasks across your workspace..."
            : "Search tasks..."}
        </span>
        <kbd className="bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] select-none md:inline-flex">
          Ctrl/Cmd K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl md:p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {scope === "workspace" ? "Search workspace tasks" : "Search tasks"}
            </DialogTitle>
            <DialogDescription>
              Search for tasks by title or description
            </DialogDescription>
          </DialogHeader>
          <Command shouldFilter={false} className="rounded-none">
            <CommandInput
              placeholder="Search by title or description..."
              className="pr-8"
              value={query}
              onValueChange={setQuery}
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
              ) : currentSearch?.error && results.length === 0 ? (
                <div
                  role="alert"
                  className="space-y-2 py-6 text-center text-sm"
                >
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
              ) : results.length === 0 && !normalizedQuery ? (
                <EmptyState
                  size="compact"
                  className="min-h-56 py-6"
                  illustration={<EmptyResultsIllustration />}
                  title="No tasks to search"
                  description="Create a task, then use search to find it quickly."
                  action={
                    boardId ? (
                      <TaskModal
                        mode="create"
                        boardId={boardId}
                        modalId={`search-new-task-board-${boardId}`}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(false)}
                          >
                            <Plus aria-hidden="true" /> Add task
                          </Button>
                        }
                      />
                    ) : undefined
                  }
                />
              ) : results.length === 0 ? (
                <EmptyState
                  size="compact"
                  className="min-h-44 py-6"
                  illustration={<EmptyResultsIllustration />}
                  title="No matching tasks"
                  description="Try a different title, keyword, or description."
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuery("")}
                    >
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <CommandGroup
                  heading={
                    normalizedQuery
                      ? nextCursor
                        ? "Search results"
                        : `${results.length} result${results.length === 1 ? "" : "s"}`
                      : scope === "workspace"
                        ? "Tasks across your workspace"
                        : "Tasks on this board"
                  }
                >
                  {results.map((task) => (
                    <SearchResultItem
                      key={task.id}
                      task={task}
                      onSelect={handleSelect}
                      showBoard={scope === "workspace"}
                    />
                  ))}
                  {nextCursor && (
                    <div
                      ref={loadMoreRef}
                      className="text-muted-foreground flex min-h-8 items-center justify-center py-1 text-xs"
                      aria-live="polite"
                    >
                      {isLoadingMore ? "Loading more..." : null}
                    </div>
                  )}
                  {currentSearch?.error && (
                    <div className="space-y-1 py-2 text-center">
                      <p className="text-destructive text-xs">
                        {currentSearch.error}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearch((current) =>
                            current ? { ...current, error: null } : current,
                          );
                          void handleLoadMore();
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                </CommandGroup>
              )}
            </CommandList>
            <div className="text-muted-foreground flex items-center justify-end gap-4 border-t px-3 py-2 text-[0.625rem]">
              <span>Up/Down Navigate</span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="size-3" aria-hidden="true" /> Open
              </span>
              <span>Esc Close</span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>

      {scope === "board" && selectedTask && (
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
