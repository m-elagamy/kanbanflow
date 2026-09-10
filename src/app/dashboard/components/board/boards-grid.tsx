"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, ChevronRight } from "lucide-react";
import type { BoardWithStats } from "@/lib/types/stores/board";
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
  const greeting = userName ? `Welcome back, ${userName}` : "Welcome back";
  const hasBoards = boards.length > 0;
  const hasMoreBoards = stats.totalBoards > boards.length;

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
            Your workspace
          </p>
          <h1 className="text-gradient text-2xl font-semibold md:text-3xl">
            {greeting}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {hasBoards
              ? "Pick up where you left off or start something new."
              : "Create a board to start organizing your work."}
          </p>
        </div>

        {hasBoards && (
          <BoardModal
            mode="create"
            modalId="dashboard-new-board"
            trigger={
              <button>
                <Plus className="h-4 w-4" />
                New board
              </button>
            }
          />
        )}
      </motion.div>

      {hasBoards ? (
        <>
          <DashboardStats {...stats} />

          <section aria-labelledby="boards-heading" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="boards-heading" className="text-lg font-semibold">
                  Your boards
                </h2>
                <p className="text-muted-foreground text-sm">
                  {stats.totalBoards}{" "}
                  {stats.totalBoards === 1 ? "board" : "boards"}
                </p>
              </div>
              {hasMoreBoards && (
                <Link
                  href="/dashboard/boards"
                  className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors"
                >
                  View all
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board, index) => (
                <BoardCard key={board.id} board={board} index={index} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <DashboardEmptyState />
      )}
    </div>
  );
}
