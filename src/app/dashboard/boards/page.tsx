import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUserBoardsPageAction } from "@/actions/user";
import { BOARDS_PAGE_SIZE } from "@/lib/constants";
import BoardCard from "../components/board/board-card";

type SearchParams = Promise<{ page?: string }>;

export default async function BoardsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const result = await getUserBoardsPageAction(page);
  const boards = result.fields?.boards ?? [];
  const totalCount = result.fields?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / BOARDS_PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 md:px-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
            All boards
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">
            {totalCount} {totalCount === 1 ? "board" : "boards"}
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground shrink-0 text-sm transition-colors"
        >
          Back to dashboard
        </Link>
      </div>

      {boards.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center text-sm">
          No boards yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board, index) => (
            <BoardCard key={board.id} board={board} index={index} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href={`/dashboard/boards?page=${page - 1}`}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={`flex items-center gap-1 text-sm ${
              page <= 1
                ? "text-muted-foreground/40 pointer-events-none"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
          <span className="text-muted-foreground text-xs">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/dashboard/boards?page=${page + 1}`}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={`flex items-center gap-1 text-sm ${
              page >= totalPages
                ? "text-muted-foreground/40 pointer-events-none"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </main>
  );
}

export const metadata: Metadata = {
  title: "All Boards",
  description: "Browse all of your KanbanFlow boards.",
};
