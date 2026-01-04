"use client";

import { Home, ChevronRight, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { BoardSummary } from "@/lib/types";
import BoardActions from "./board-actions";
import { TaskPriorityFilter } from "../task/tasks-filter";
import { BoardSearch } from "./board-search";
import TaskModal from "../task/task-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
      <div className="p-6 pb-4">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">
            {board.title?.replace(/-/g, " ")}
          </span>
        </div>

        {/* Top Row: Title/Description and Board Actions */}
        <div className="mb-4 flex items-start justify-between">
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
          <div className="flex items-center gap-2">
            {activeBoardId && (
              <TaskModal
                mode="create"
                boardId={activeBoardId}
                trigger={
                  <Button>
                    <Plus size={16} />
                    Create New Task
                  </Button>
                }
                variant="default"
              />
            )}
            <BoardActions board={board} />
          </div>
        </div>

        {/* Bottom Row: Quick Actions Bar */}
        <div className="flex items-center justify-end gap-3">
          <TaskPriorityFilter />
          <BoardSearch />
        </div>
      </div>
    </section>
  );
};

export default BoardHeader;
