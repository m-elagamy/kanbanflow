import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* Search */}
      <Skeleton className="h-9 w-full rounded-md" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="border-border/60 bg-background/80 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:p-4"
          >
            <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Needs attention */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="border-border/80 bg-background/80 flex items-center gap-3 rounded-xl border p-4">
          <Skeleton className="size-9 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
        </div>
      </div>

      {/* Boards */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
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
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="mt-auto flex gap-2 pt-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
