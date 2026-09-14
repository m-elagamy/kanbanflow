import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Plus, Search, X } from "lucide-react";
import { getUserBoardsPageAction } from "@/actions/user";
import { Button } from "@/components/ui/button";
import EmptyBoardsIllustration from "@/components/ui/empty-boards-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { BOARDS_PAGE_SIZE } from "@/lib/constants";
import BoardCard from "../components/board/board-card";
import BoardModal from "../components/board/board-modal";
import Pagination from "../components/pagination";

type SearchParams = Promise<{ page?: string; q?: string }>;

function boardsHref(page: number, query = "") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return `/dashboard/boards${search ? `?${search}` : ""}`;
}

export default async function BoardsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam, q: queryParam = "" } = await searchParams;
  const query = queryParam.trim().slice(0, 100);
  const page = Number(pageParam ?? "1");
  if (query !== queryParam) redirect(boardsHref(1, query));
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 2147483647 / BOARDS_PAGE_SIZE
  ) {
    redirect(boardsHref(1, query));
  }

  const result = await getUserBoardsPageAction(page, query);
  if (!result.success || !result.fields) {
    throw new Error("Failed to load boards. Please try again.");
  }
  const { boards, totalCount } = result.fields;
  const totalPages = Math.max(1, Math.ceil(totalCount / BOARDS_PAGE_SIZE));
  if (page > totalPages) {
    redirect(boardsHref(totalPages, query));
  }
  const hasQuery = query.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
              Your workspace
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">All boards</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Choose a board to view and manage its tasks.
            </p>
          </div>
          {(hasQuery || totalCount > 0) && (
            <BoardModal
              mode="create"
              modalId="all-boards-new-board"
              trigger={
                <button>
                  <Plus aria-hidden="true" />
                  New board
                </button>
              }
            />
          )}
        </div>
      </div>

      <form action="/dashboard/boards" className="mb-6 flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="boards-search" className="sr-only">
            Search boards
          </label>
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            id="boards-search"
            name="q"
            type="search"
            defaultValue={query}
            maxLength={100}
            placeholder="Search boards by name or description"
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
        {hasQuery && (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/boards" aria-label="Clear board search">
              <X aria-hidden="true" />
            </Link>
          </Button>
        )}
      </form>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium" aria-live="polite">
          {hasQuery ? "Search results" : "All boards"} · {totalCount}{" "}
          {totalCount === 1 ? "board" : "boards"}
        </p>
        {totalPages > 1 && (
          <p className="text-muted-foreground text-xs">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {boards.length === 0 ? (
        <div className="border-border/80 bg-background/80 rounded-xl border shadow-sm">
          {hasQuery ? (
            <EmptyState
              size="compact"
              illustration={
                <Search
                  className="text-muted-foreground size-8"
                  aria-hidden="true"
                />
              }
              title="No matching boards"
              description={`No boards match “${query}”. Try another name or description.`}
              action={
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/boards">Clear search</Link>
                </Button>
              }
            />
          ) : (
            <EmptyState
              illustration={<EmptyBoardsIllustration />}
              title="No boards yet"
              description="Create a board to start organizing your tasks and projects."
              action={
                <BoardModal
                  mode="create"
                  modalId="all-boards-empty-new-board"
                  trigger={
                    <button>
                      <Plus aria-hidden="true" />
                      Create a board
                    </button>
                  }
                />
              }
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board, index) => (
            <BoardCard key={board.id} board={board} index={index} />
          ))}
        </div>
      )}

      <Pagination
        ariaLabel="Boards pagination"
        currentPage={page}
        totalPages={totalPages}
        hrefForPage={(pageNumber) => boardsHref(pageNumber, query)}
      />
    </main>
  );
}

export const metadata: Metadata = {
  title: "All Boards",
  description: "Browse all of your KanbanFlow boards.",
};
