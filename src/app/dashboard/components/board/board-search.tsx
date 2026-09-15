"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, LayoutDashboard, Plus, Search } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getBoardTasksPageAction,
  getWorkspaceTasksPageAction,
} from "@/actions/task";
import { getUserBoardsPageAction } from "@/actions/user";
import useBoardStore from "@/stores/board";
import { useModalStore } from "@/stores/modal";
import type { ClientTask, TaskSearchPage, TaskSearchResult } from "@/lib/types";
import type { BoardWithStats } from "@/lib/types/stores/board";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import TaskModal from "../task/task-modal";
import PriorityIndicator from "../task/priority-indicator";

type TaskSearchState = TaskSearchPage & {
  key: string;
  error: string | null;
};

type BoardSearchState = {
  key: string;
  items: BoardWithStats[];
  page: number;
  totalCount: number;
  error: string | null;
};

function BoardSearchResultItem({
  board,
  onSelect,
}: {
  board: BoardWithStats;
  onSelect: (board: BoardWithStats) => void;
}) {
  return (
    <CommandItem
      value={`board-${board.id}`}
      onSelect={() => onSelect(board)}
      className="flex items-center gap-3 px-3 py-3"
    >
      <LayoutDashboard
        className="text-muted-foreground size-4 shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{board.title}</p>
        {board.description && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {board.description}
          </p>
        )}
      </div>
    </CommandItem>
  );
}

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
        <PriorityIndicator priority={task.priority} />
      </div>
    </CommandItem>
  );
}

export function BoardSearch({
  scope = "board",
  boardId: providedBoardId,
}: {
  scope?: "board" | "workspace";
  boardId?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "boards">("boards");
  const [taskSearch, setTaskSearch] = useState<TaskSearchState | null>(null);
  const [boardSearch, setBoardSearch] = useState<BoardSearchState | null>(null);
  const [retry, setRetry] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ClientTask | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const openModal = useModalStore((state) => state.openModal);
  const boardId =
    scope === "board" ? (providedBoardId ?? activeBoardId) : null;
  const canSearch = scope === "workspace" || Boolean(boardId);
  const normalizedQuery = query.trim();
  const taskSearchKey = `${scope}:${boardId ?? "all"}:${normalizedQuery}`;
  const boardSearchKey = `workspace:${normalizedQuery}`;
  const currentTaskSearch =
    taskSearch?.key === taskSearchKey ? taskSearch : null;
  const currentBoardSearch =
    boardSearch?.key === boardSearchKey ? boardSearch : null;
  const isBoardTab = scope === "workspace" && activeTab === "boards";
  const nextCursor = currentTaskSearch?.nextCursor ?? null;
  const hasMoreBoards = Boolean(
    currentBoardSearch &&
    currentBoardSearch.items.length < currentBoardSearch.totalCount,
  );

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
          if (scope === "workspace") {
            const [boardsResult, tasksResult] = await Promise.all([
              getUserBoardsPageAction(1, normalizedQuery),
              getWorkspaceTasksPageAction(
                normalizedQuery,
                null,
                TASKS_PAGE_SIZE,
              ),
            ]);
            if (cancelled) return;

            setBoardSearch({
              key: boardSearchKey,
              items: boardsResult.success
                ? (boardsResult.fields?.boards ?? [])
                : [],
              page: 1,
              totalCount: boardsResult.success
                ? (boardsResult.fields?.totalCount ?? 0)
                : 0,
              error: boardsResult.success ? null : boardsResult.message,
            });
            setTaskSearch({
              key: taskSearchKey,
              items: tasksResult.success
                ? (tasksResult.fields?.items ?? [])
                : [],
              nextCursor: tasksResult.success
                ? (tasksResult.fields?.nextCursor ?? null)
                : null,
              error: tasksResult.success ? null : tasksResult.message,
            });
          } else {
            const result = await getBoardTasksPageAction(
              boardId!,
              normalizedQuery,
              null,
              TASKS_PAGE_SIZE,
            );
            if (cancelled) return;
            setTaskSearch({
              key: taskSearchKey,
              items: result.success ? (result.fields?.items ?? []) : [],
              nextCursor: result.success
                ? (result.fields?.nextCursor ?? null)
                : null,
              error: result.success ? null : result.message,
            });
          }
        } catch {
          if (!cancelled) {
            if (scope === "workspace") {
              setBoardSearch({
                key: boardSearchKey,
                items: [],
                page: 1,
                totalCount: 0,
                error: "Search failed. Please try again.",
              });
            }
            setTaskSearch({
              key: taskSearchKey,
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
  }, [
    boardId,
    boardSearchKey,
    canSearch,
    normalizedQuery,
    open,
    retry,
    scope,
    taskSearchKey,
  ]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
      setActiveTab("boards");
      setTaskSearch(null);
      setBoardSearch(null);
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
        columnEnteredAt: task.columnEnteredAt,
      };
      setSelectedTask(clientTask);
      setOpen(false);
      setQuery("");
      setTaskSearch(null);
      setBoardSearch(null);

      if (scope === "workspace") {
        router.push(`/dashboard/${task.board.slug}?task=${task.id}`);
      } else {
        setTimeout(() => openModal("task", `search-task-${task.id}`), 0);
      }
    },
    [openModal, router, scope],
  );

  const handleBoardSelect = useCallback(
    (board: BoardWithStats) => {
      setOpen(false);
      setQuery("");
      setBoardSearch(null);
      setTaskSearch(null);
      router.push(`/dashboard/${board.slug}`);
    },
    [router],
  );

  const handleLoadMore = useCallback(async () => {
    if (
      !canSearch ||
      isLoadingMore ||
      (isBoardTab ? !hasMoreBoards : !nextCursor)
    )
      return;

    setIsLoadingMore(true);
    const requestedKey = isBoardTab ? boardSearchKey : taskSearchKey;
    try {
      if (isBoardTab) {
        const nextPage = (currentBoardSearch?.page ?? 1) + 1;
        const result = await getUserBoardsPageAction(nextPage, normalizedQuery);
        if (!result.success || !result.fields) {
          setBoardSearch((current) =>
            current?.key === requestedKey
              ? { ...current, error: result.message }
              : current,
          );
          return;
        }
        const page = result.fields;

        setBoardSearch((current) => {
          if (current?.key !== requestedKey) return current;
          const existingIds = new Set(current.items.map((board) => board.id));
          return {
            ...current,
            items: [
              ...current.items,
              ...page.boards.filter((board) => !existingIds.has(board.id)),
            ],
            page: nextPage,
            totalCount: page.totalCount,
            error: null,
          };
        });
        return;
      }

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
        setTaskSearch((current) =>
          current?.key === requestedKey
            ? { ...current, error: result.message }
            : current,
        );
        return;
      }
      const page = result.fields;

      setTaskSearch((current) => {
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
      if (isBoardTab) {
        setBoardSearch((current) =>
          current?.key === requestedKey
            ? { ...current, error: "Search failed. Please try again." }
            : current,
        );
      } else {
        setTaskSearch((current) =>
          current?.key === requestedKey
            ? { ...current, error: "Search failed. Please try again." }
            : current,
        );
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    boardId,
    boardSearchKey,
    canSearch,
    currentBoardSearch,
    hasMoreBoards,
    isBoardTab,
    isLoadingMore,
    nextCursor,
    normalizedQuery,
    scope,
    taskSearchKey,
  ]);

  useEffect(() => {
    const target = loadMoreRef.current;
    const error = isBoardTab
      ? currentBoardSearch?.error
      : currentTaskSearch?.error;
    const hasMore = isBoardTab ? hasMoreBoards : Boolean(nextCursor);
    if (!target || !hasMore || isLoadingMore || error) return;

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
  }, [
    currentBoardSearch?.error,
    currentTaskSearch?.error,
    handleLoadMore,
    hasMoreBoards,
    isBoardTab,
    isLoadingMore,
    nextCursor,
  ]);

  const currentSearch = isBoardTab ? currentBoardSearch : currentTaskSearch;
  const isPending = Boolean(open && canSearch && !currentSearch);
  const taskResults = currentTaskSearch?.items ?? [];
  const boardResults = currentBoardSearch?.items ?? [];
  const results = isBoardTab ? boardResults : taskResults;

  return (
    <>
      <Button
        variant="outline"
        className={`text-muted-foreground h-9 min-w-0 justify-start gap-2 pr-2 pl-3 text-sm font-normal ${scope === "workspace" ? "w-full" : "sm:w-50 md:w-62.5"}`}
        onClick={() => setOpen(true)}
      >
        <Search size={14} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">
          {scope === "workspace" ? "Search workspace..." : "Search tasks..."}
        </span>
        <kbd className="bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] select-none md:inline-flex">
          Ctrl/Cmd K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl md:p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {scope === "workspace" ? "Search workspace" : "Search tasks"}
            </DialogTitle>
            <DialogDescription>
              {scope === "workspace"
                ? "Search for boards and tasks by title or description"
                : "Search for tasks by title or description"}
            </DialogDescription>
          </DialogHeader>
          <Command shouldFilter={false} className="rounded-none">
            <Tabs
              value={scope === "workspace" ? activeTab : "tasks"}
              onValueChange={(value) =>
                setActiveTab(value as "tasks" | "boards")
              }
              className="gap-0"
            >
              <CommandInput
                placeholder={
                  isBoardTab
                    ? "Search boards..."
                    : "Search tasks by title or description..."
                }
                className="pr-8"
                value={query}
                onValueChange={setQuery}
              />
              {scope === "workspace" && (
                <TabsList className="mx-3 mt-3 grid w-auto grid-cols-2">
                  <TabsTrigger value="boards">Boards</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
              )}
              <CommandList>
                {isPending ? (
                  <div
                    className="space-y-2 p-3"
                    aria-label={`Searching ${isBoardTab ? "boards" : "tasks"}`}
                  >
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
                        if (isBoardTab) setBoardSearch(null);
                        else setTaskSearch(null);
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
                    title={
                      isBoardTab ? "No boards to search" : "No tasks to search"
                    }
                    description={
                      isBoardTab
                        ? "Create a board, then use search to find it quickly."
                        : "Create a task, then use search to find it quickly."
                    }
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
                    title={
                      isBoardTab ? "No matching boards" : "No matching tasks"
                    }
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
                  <CommandGroup heading={isBoardTab ? "Boards" : "Tasks"}>
                    {isBoardTab
                      ? boardResults.map((board) => (
                          <BoardSearchResultItem
                            key={board.id}
                            board={board}
                            onSelect={handleBoardSelect}
                          />
                        ))
                      : taskResults.map((task) => (
                          <SearchResultItem
                            key={task.id}
                            task={task}
                            onSelect={handleSelect}
                            showBoard={scope === "workspace"}
                          />
                        ))}
                    {(isBoardTab ? hasMoreBoards : Boolean(nextCursor)) && (
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
                            if (isBoardTab) {
                              setBoardSearch((current) =>
                                current ? { ...current, error: null } : current,
                              );
                            } else {
                              setTaskSearch((current) =>
                                current ? { ...current, error: null } : current,
                              );
                            }
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
            </Tabs>
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
