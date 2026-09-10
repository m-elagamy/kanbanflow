import { Skeleton } from "@/components/ui/skeleton";

const BoardHeaderSkeleton = () => {
  return (
    <section className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/60 mb-4 flex-shrink-0 border-b backdrop-blur">
      <div className="p-4 sm:p-6 sm:pb-4">
        {/* Top Row: Title/Description and Actions */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Skeleton className="size-11 shrink-0 rounded-xl md:size-12" />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <Skeleton className="h-7 w-48 md:h-8 md:w-64" />
              <Skeleton className="h-4 w-44 sm:w-72" />
            </div>
          </div>
          <div className="ml-4">
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>

        {/* Bottom Row: Quick Actions */}
        <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:gap-3">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 min-w-0 rounded-md sm:w-[200px] md:w-[250px]" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default BoardHeaderSkeleton;
