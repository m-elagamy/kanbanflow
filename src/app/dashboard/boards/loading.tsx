import { Skeleton } from "@/components/ui/skeleton";

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

      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      <Skeleton className="mb-4 h-4 w-24" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-border/60 bg-background/80 flex flex-col gap-4 rounded-xl border p-5"
          >
            <div className="flex items-start justify-between gap-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="size-4 shrink-0" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-auto flex gap-2 pt-1">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
