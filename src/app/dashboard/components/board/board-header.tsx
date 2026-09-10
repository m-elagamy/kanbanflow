"use client";

import { Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { BoardSummary } from "@/lib/types";
import BoardActions from "./board-actions";
import { TaskPriorityFilter } from "../task/tasks-filter";
import { BoardSearch } from "./board-search";
import TaskModal from "../task/task-modal";
import { Button } from "@/components/ui/button";
import useBoardStore from "@/stores/board";

type BoardHeaderProps = {
  board: BoardSummary;
};

const BoardHeader = ({ board }: BoardHeaderProps) => {
  const activeBoardId = useBoardStore(
    useShallow((state) => state.activeBoardId),
  );

  return (
    <section className="border-border/50 bg-background/95 supports-backdrop-filter:bg-background/60 mb-4 shrink-0 border-b backdrop-blur">
      <div className="p-4 sm:p-6 sm:pb-4">
        {/* Top Row: Title/Description and Board Actions */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold capitalize md:text-2xl">
              {board.title?.replace(/-/g, " ")}
            </h1>
            {board.description && (
              <p className="text-muted-foreground mt-1 max-w-md truncate text-sm">
                {board.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {activeBoardId && (
              <TaskModal
                mode="create"
                boardId={activeBoardId}
                trigger={
                  <Button>
                    <Plus size={16} />
                    <span className="hidden sm:inline">Create New Task</span>
                    <span className="sm:hidden">Task</span>
                  </Button>
                }
                variant="default"
              />
            )}
            <BoardActions board={board} />
          </div>
        </div>

        {/* Bottom Row: Quick Actions Bar */}
        <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:justify-end sm:gap-3">
          <TaskPriorityFilter />
          <BoardSearch />
        </div>
      </div>
    </section>
  );
};

export default BoardHeader;
