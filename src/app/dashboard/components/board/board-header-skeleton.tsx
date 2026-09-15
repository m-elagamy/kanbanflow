import {
  FolderKanban,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskPriorityFilter } from "../task/tasks-filter";
import { BoardActionsTrigger } from "./board-actions";

const BoardHeaderSkeleton = ({
  hasDescription = false,
}: {
  hasDescription?: boolean;
}) => {
  return (
    <section className="border-border/50 bg-background/95 supports-backdrop-filter:bg-background/60 mb-4 shrink-0 border-b backdrop-blur">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 lg:flex-1">
          <span className="bg-primary/10 text-primary ring-primary/15 flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 md:size-12">
            <FolderKanban className="size-5 md:size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 pt-0.5">
            <Skeleton className="h-7 w-36 md:h-8 md:w-48" />
            {hasDescription && (
              <Skeleton className="mt-1 h-4 w-44 sm:w-72" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:justify-end">
          <TaskPriorityFilter />
          <Button
            variant="outline"
            className="text-muted-foreground h-9 min-w-0 justify-start gap-2 pr-2 pl-3 text-sm font-normal sm:w-50 md:w-62.5"
            aria-disabled="true"
            tabIndex={-1}
          >
            <Search size={14} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-left">
              Search tasks...
            </span>
            <kbd className="bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] select-none md:inline-flex">
              Ctrl/Cmd K
            </kbd>
          </Button>
          <Button className="shrink-0" aria-disabled="true" tabIndex={-1}>
            <Plus size={16} aria-hidden="true" />
            <span>Add task</span>
          </Button>
          <span className="pointer-events-none">
            <BoardActionsTrigger interactive={false} />
          </span>
        </div>
      </div>
    </section>
  );
};

export default BoardHeaderSkeleton;
