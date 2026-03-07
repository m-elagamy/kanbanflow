"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Layers, ListTodo } from "lucide-react";
import type { BoardWithStats } from "@/lib/types/stores/board";
import BoardActions from "./board-actions";

interface BoardCardProps {
  board: BoardWithStats;
  index: number;
}

export default function BoardCard({ board, index }: BoardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: Math.min(index * 0.06, 0.3),
      }}
      className="border-border/60 bg-background/80 hover:border-primary/30 hover:bg-background group relative overflow-hidden rounded-xl border shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="via-primary/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <Link
        href={`/dashboard/${board.slug}`}
        className="flex h-full flex-col gap-4 p-5 pr-14"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
              Board
            </p>
            <h2 className="group-hover:text-primary mt-2 text-base leading-snug font-semibold transition-colors duration-200">
              {board.title}
            </h2>
          </div>

          <ArrowUpRight className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm leading-6">
          {board.description?.trim() ||
            "No description yet. Add context to make this board easier to scan for collaborators."}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs">
            <Layers className="h-3.5 w-3.5" />
            {board._count.columns}{" "}
            {board._count.columns === 1 ? "column" : "columns"}
          </span>
          <span className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs">
            <ListTodo className="h-3.5 w-3.5" />
            {board._count.tasks} {board._count.tasks === 1 ? "task" : "tasks"}
          </span>
        </div>

        <p className="text-muted-foreground text-xs font-medium">
          Open board to continue planning
        </p>
      </Link>

      <div className="absolute top-3 right-3 opacity-100 transition-opacity duration-150 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <BoardActions board={board} />
      </div>
    </motion.div>
  );
}
