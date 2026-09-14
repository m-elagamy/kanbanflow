import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPageLoading() {
  return (
    <main className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">
      <div className="mb-4 shrink-0 space-y-2 sm:mb-6">
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="mb-4 flex shrink-0 gap-2 overflow-hidden sm:mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-28 rounded-full" />
        ))}
      </div>
      <Skeleton className="mb-3 h-4 w-16 shrink-0" />
      <div className="border-border/80 bg-background/80 divide-border/80 min-h-0 flex-1 overflow-hidden rounded-xl border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-4">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
