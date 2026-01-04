import { Skeleton } from "@/components/ui/skeleton";

const BoardHeaderSkeleton = () => {
  return (
    <section className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/60 mb-4 flex-shrink-0 border-b backdrop-blur">
      <div className="p-6 pb-4">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Top Row: Title/Description and Actions */}
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-7 w-48 md:h-8 md:w-64" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="ml-4">
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>

        {/* Bottom Row: Quick Actions */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-[200px] md:w-[250px] rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default BoardHeaderSkeleton;
