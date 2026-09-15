import { Skeleton } from "@/components/ui/skeleton";

const BoardHeaderSkeleton = () => {
  return (
    <section className="border-border/50 bg-background/95 supports-backdrop-filter:bg-background/60 mb-4 shrink-0 border-b backdrop-blur">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 lg:flex-1">
          <Skeleton className="size-11 shrink-0 rounded-xl md:size-12" />
          <div className="min-w-0 space-y-2 pt-0.5">
            <Skeleton className="h-7 w-36 md:h-8 md:w-48" />
            <Skeleton className="h-4 w-44 sm:w-72" />
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:justify-end">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="h-9 min-w-0 rounded-md sm:w-52" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default BoardHeaderSkeleton;
