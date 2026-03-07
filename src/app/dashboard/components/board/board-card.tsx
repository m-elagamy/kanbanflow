"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Layers, ListTodo } from "lucide-react";
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
      transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.06, 0.3) }}
      className="border-border/60 bg-background/80 hover:border-primary/30 hover:bg-background group relative rounded-2xl border shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <Link
        href={`/dashboard/${board.slug}`}
        className="flex h-full flex-col gap-4 p-5"
      >
        <div className="flex items-start justify-between gap-8">
          <h2 className="necessary-ellipsis text-base font-semibold leading-snug transition-colors duration-200 group-hover:text-primary">
            {board.title}
          </h2>
        </div>

        {board.description && (
          <p className="text-muted-foreground necessary-ellipsis text-xs leading-relaxed">
            {board.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-4 pt-1">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Layers className="h-3.5 w-3.5" />
            {board._count.columns}{" "}
            {board._count.columns === 1 ? "column" : "columns"}
          </span>
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ListTodo className="h-3.5 w-3.5" />
            {board._count.tasks}{" "}
            {board._count.tasks === 1 ? "task" : "tasks"}
          </span>
        </div>
      </Link>

      <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <BoardActions board={board} />
      </div>
    </motion.div>
  );
}
