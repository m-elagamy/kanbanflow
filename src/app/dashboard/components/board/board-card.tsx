import Link from "next/link";
import { ArrowUpRight, Layers, ListTodo } from "lucide-react";
import type { BoardWithStats } from "@/lib/types/stores/board";
import { getBoardIdentity } from "@/lib/utils/board-identity";
import BoardActions from "./board-actions";

interface BoardCardProps {
  board: BoardWithStats;
}

export default function BoardCard({
  board,
}: BoardCardProps) {
  const identity = getBoardIdentity(board.title, board.id);

  return (
    <div
      className="border-border/80 bg-card hover:border-primary/30 group relative overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="via-primary/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <Link
        href={`/dashboard/${board.slug}`}
        className="flex h-full flex-col gap-3 p-4 pr-12"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`${identity.className} flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold`}
                aria-hidden="true"
              >
                {identity.initial}
              </span>
              <h2 className="group-hover:text-primary truncate text-base leading-snug font-semibold transition-colors duration-200">
                {board.title}
              </h2>
            </div>
          </div>

          <ArrowUpRight
            className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm leading-5">
          {board.description?.trim() || "No description"}
        </p>

        <div className="border-border/50 text-muted-foreground mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3.5" aria-hidden="true" />
            {board._count.columns}{" "}
            {board._count.columns === 1 ? "column" : "columns"}
          </span>
          <span className="inline-flex items-center gap-1">
            <ListTodo className="size-3.5" aria-hidden="true" />
            {board._count.openTasks} open{" "}
            {board._count.openTasks === 1 ? "task" : "tasks"}
          </span>
        </div>
      </Link>

      <div className="absolute top-3 right-3 opacity-100 transition-opacity duration-150 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <BoardActions board={board} />
      </div>
    </div>
  );
}
