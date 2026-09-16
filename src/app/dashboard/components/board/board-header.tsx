"use client";

import { FolderKanban, Plus } from "lucide-react";
import type { BoardSummary } from "@/lib/types";
import BoardActions from "./board-actions";
import { TaskPriorityFilter } from "../task/tasks-filter";
import { BoardSearch } from "./board-search";
import TaskModal from "../task/task-modal";
import { Button } from "@/components/ui/button";

type BoardHeaderProps = {
  board: BoardSummary;
};

const BoardHeader = ({ board }: BoardHeaderProps) => {
  return (
    <section className="border-border/50 bg-background/95 supports-backdrop-filter:bg-background/60 mb-4 shrink-0 border-b backdrop-blur">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-14 min-w-0 items-start gap-3 lg:flex-1">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="bg-primary/10 text-primary ring-primary/15 flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 md:size-12">
              <FolderKanban className="size-5 md:size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <h1 className="truncate text-xl font-semibold capitalize md:text-2xl">
                {board.title?.replace(/-/g, " ")}
              </h1>
              {board.description && (
                <p
                  className="text-muted-foreground mt-1 max-w-md truncate text-sm"
                  title={board.description}
                  dir="auto"
                >
                  {board.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:justify-end">
          <TaskPriorityFilter />
          <BoardSearch boardId={board.id} />
          {board.id && (
            <TaskModal
              mode="create"
              boardId={board.id}
              trigger={
                <Button className="shrink-0">
                  <Plus size={16} />
                  <span>Add task</span>
                </Button>
              }
            />
          )}
          <BoardActions board={board} />
        </div>
      </div>
    </section>
  );
};

export default BoardHeader;
