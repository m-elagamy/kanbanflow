"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PlusCircle, ChevronRight } from "lucide-react";
import type { BoardWithStats } from "@/lib/types/stores/board";
import { BOARDS_LIST_LIMIT } from "@/lib/constants";
import BoardCard from "./board-card";
import BoardModal from "./board-modal";
import DashboardStats from "./dashboard-stats";
import DashboardEmptyState from "./dashboard-empty-state";

interface BoardsGridProps {
  boards: BoardWithStats[];
  userName: string | null;
  stats: {
    totalBoards: number;
    totalTasks: number;
    highPriorityTasks: number;
  };
}

export default function BoardsGrid({
  boards,
  userName,
  stats,
}: BoardsGridProps) {
  const greeting = userName ? `Good to see you, ${userName}` : "Welcome back";
  const hasBoards = boards.length > 0;
  const isAtLimit = boards.length === BOARDS_LIST_LIMIT;

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-[0.25em] uppercase">
            Dashboard
          </p>
          <h1 className="text-gradient text-2xl font-semibold md:text-3xl">
            {greeting}
          </h1>
          {!hasBoards && (
            <p className="text-muted-foreground mt-1 text-sm">No boards yet</p>
          )}
        </div>

        {hasBoards && (
          <BoardModal
            mode="create"
            modalId="dashboard-new-board"
            trigger={
              <button>
                <PlusCircle className="h-4 w-4" />
                New board
              </button>
            }
          />
        )}
      </motion.div>

      {hasBoards ? (
        <>
          <DashboardStats {...stats} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board, index) => (
              <BoardCard key={board.id} board={board} index={index} />
            ))}
          </div>

          {isAtLimit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex justify-center"
            >
              <Link
                href="/dashboard/boards"
                className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors"
              >
                View all boards
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          )}
        </>
      ) : (
        <DashboardEmptyState />
      )}
    </div>
  );
}
