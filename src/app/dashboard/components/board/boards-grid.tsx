"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, ChevronRight, Sparkles } from "lucide-react";
import type { BoardWithStats } from "@/lib/types/stores/board";
import BoardCard from "./board-card";
import BoardModal from "./board-modal";
import DashboardStats from "./dashboard-stats";
import DashboardEmptyState from "./dashboard-empty-state";
import DashboardFocus from "./dashboard-focus";
import DashboardClock from "./dashboard-clock";
import { BoardSearch } from "./board-search";
import type { DashboardFocusPreview } from "@/lib/types";

interface BoardsGridProps {
  boards: BoardWithStats[];
  userName: string | null;
  stats: {
    totalBoards: number;
    openTasks: number;
  };
  focusTasks: DashboardFocusPreview | null;
}

function getGreetingPrefix(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Welcome back";
}

export default function BoardsGrid({
  boards,
  userName,
  stats,
  focusTasks,
}: BoardsGridProps) {
  const greetingPrefix = getGreetingPrefix();
  const greeting = userName ? `${greetingPrefix}, ${userName}` : greetingPrefix;
  const hasBoards = boards.length > 0;
  const hasMoreBoards = stats.totalBoards > boards.length;
  const focusCount = focusTasks?.items.length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className="dashboard-welcome-glow pointer-events-none absolute -inset-x-12 -inset-y-8"
          />
          <div className="relative">
            <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-[0.25em]">
              Your workspace
            </p>
            <h1 className="text-gradient text-2xl font-semibold md:text-3xl">
              {greeting}
            </h1>
            {hasBoards && focusCount > 0 ? (
              <div className="mt-2.5">
                <div className="border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-xs backdrop-blur-xs">
                  <Sparkles className="text-amber-500 size-3.5 animate-pulse shrink-0" aria-hidden="true" />
                  <span>
                    You have <strong className="text-foreground font-semibold">{focusCount}</strong> {focusCount === 1 ? "task" : "tasks"} needing attention today
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground mt-1.5 text-sm">
                {hasBoards
                  ? "Search your workspace or choose a board to keep things moving."
                  : "Your workspace is ready when you are."}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DashboardClock />
          {hasBoards && (
            <BoardModal
              mode="create"
              trigger={
                <button>
                  <Plus className="h-4 w-4" />
                  New board
                </button>
              }
            />
          )}
        </div>
      </motion.div>

      {hasBoards ? (
        <>
          <BoardSearch scope="workspace" />

          <DashboardStats {...stats} />

          <DashboardFocus tasks={focusTasks} />

          <section aria-labelledby="boards-heading" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="boards-heading" className="text-lg font-semibold">
                  Your boards
                </h2>
                <p className="text-muted-foreground text-sm">
                  Choose a board to view and manage its tasks.
                </p>
              </div>
              {hasMoreBoards && (
                <Link
                  href="/dashboard/boards"
                  className="text-foreground/70 hover:text-foreground group flex items-center gap-1 text-sm transition-colors"
                >
                  View all {stats.totalBoards}
                  <ChevronRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
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
