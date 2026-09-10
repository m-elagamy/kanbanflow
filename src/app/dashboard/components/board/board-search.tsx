"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useBoardStore from "@/stores/board";
import { useModalStore } from "@/stores/modal";
import { searchTasksAction } from "@/actions/task";
import getBadgeStyle from "../../utils/get-badge-style";
import type { TaskSearchResult } from "@/lib/types";

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

  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
      setOpen(false);
      setQuery("");
      openModal("task", `task-${taskId}`);
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
        <Search size={14} />
        <span className="min-w-0 flex-1 truncate text-left">
          Search tasks...
        </span>
        <kbd className="bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] select-none md:inline-flex">
          ⌘K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Search tasks</DialogTitle>
            <DialogDescription>
              Search for tasks by title or description
            </DialogDescription>
          </DialogHeader>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search tasks..."
              value={query}
              onValueChange={(value) => {
                setQuery(value);
                setSearch(null);
              }}
            />
            <CommandList>
              {isPending ? (
                <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  Searching...
                </div>
              ) : !query.trim() ? (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  Type to search tasks...
                </div>
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
                <CommandEmpty>No tasks found.</CommandEmpty>
              ) : (
                <CommandGroup
                  heading={`${visibleResults.length} result${visibleResults.length !== 1 ? "s" : ""}`}
                >
                  {visibleResults.map((task) => (
                    <CommandItem
                      key={task.id}
                      value={task.id}
                      onSelect={() => handleSelect(task.id)}
                      className="flex items-center gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-muted-foreground truncate text-xs">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {task.column.status}
                        </span>
                        <Badge
                          className={`${getBadgeStyle(task.priority)} h-5 px-2 text-[0.625rem] font-medium uppercase`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
