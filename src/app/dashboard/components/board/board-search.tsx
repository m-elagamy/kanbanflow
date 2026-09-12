"use client";

import { useCallback, useEffect, useState } from "react";
import { CornerDownLeft, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { ClientTask } from "@/lib/types";
import getBadgeStyle from "../../utils/get-badge-style";
import TaskModal from "../task/task-modal";

type SearchTask = ClientTask & {
  column: { status: string };
};

function SearchResultItem({
  task,
  onSelect,
}: {
  task: SearchTask;
  onSelect: (task: SearchTask) => void;
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
  const [selectedTask, setSelectedTask] = useState<ClientTask | null>(null);

  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const columns = useColumnStore((state) =>
    activeBoardId ? state.columnsByBoard[activeBoardId] : undefined,
  );
  const tasks = useTaskStore((state) => state.tasks);
  const openModal = useModalStore((state) => state.openModal);

  const boardTasks: SearchTask[] = Object.values(tasks)
    .filter((task) => columns?.[task.columnId])
    .sort((a, b) => {
      const columnOrder =
        (columns?.[a.columnId]?.order ?? 0) -
        (columns?.[b.columnId]?.order ?? 0);
      return columnOrder || a.order - b.order;
    })
    .map((task) => ({
      ...task,
      column: { status: columns?.[task.columnId]?.status ?? "" },
    }));

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const results = normalizedQuery
    ? boardTasks
        .filter(
          (task) =>
            task.title.toLocaleLowerCase().includes(normalizedQuery) ||
            task.description?.toLocaleLowerCase().includes(normalizedQuery),
        )
        .slice(0, 20)
    : boardTasks.slice(0, 5);

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

  const handleSelect = useCallback(
    (task: SearchTask) => {
      setSelectedTask(task);
      setOpen(false);
      setQuery("");
      setTimeout(() => openModal("task", `search-task-${task.id}`), 0);
    },
    [openModal],
  );

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setQuery("");
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground h-9 min-w-0 justify-start gap-2 pr-2 pl-3 text-sm font-normal sm:w-50 md:w-62.5"
        onClick={() => setOpen(true)}
      >
        <Search size={14} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">
          Search tasks...
        </span>
        <kbd className="bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] select-none md:inline-flex">
          Ctrl/⌘ K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl md:p-0">
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
              onValueChange={setQuery}
            />
            <CommandList>
              {boardTasks.length === 0 ? (
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
                        modalId={`search-new-task-board-${activeBoardId}`}
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
              ) : results.length === 0 ? (
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
                      ? `${results.length} result${results.length === 1 ? "" : "s"}`
                      : "Tasks on this board"
                  }
                >
                  {results.map((task) => (
                    <SearchResultItem
                      key={task.id}
                      task={task}
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
