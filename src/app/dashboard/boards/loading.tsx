import { Skeleton } from "@/components/ui/skeleton";
import BoardsCardsSkeleton from "./boards-cards-skeleton";

export default function BoardsPageLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="mb-6">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      <Skeleton className="mb-6 h-9 w-full rounded-md" />

      <BoardsCardsSkeleton />
    </main>
  );
}
