import { Home, ChevronRight } from "lucide-react";
import type { BoardSummary } from "@/lib/types";
import BoardActions from "./board-actions";
import { TaskPriorityFilter } from "../task/tasks-filter";
import Link from "next/link";

type BoardHeaderProps = {
  board: BoardSummary;
};

const BoardHeader = ({ board }: BoardHeaderProps) => {
  return (
    <section className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/60 mb-4 flex-shrink-0 border-b backdrop-blur">
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
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold capitalize md:text-2xl">
                    {board.title?.replace(/-/g, " ")}
                  </h1>
                  {board.description && (
                    <p className="text-muted-foreground max-w-md truncate text-sm">
                      {board.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <TaskPriorityFilter />
            <BoardActions board={board} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardHeader;
