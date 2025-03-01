import { Skeleton } from "@/components/ui/skeleton";

const BoardHeaderSkeleton = () => {
  return (
    <section className="mb-4 pb-6 pt-8">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-lg" /> {/* Icon */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-36 rounded-lg" /> {/* Title */}
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Info Icon */}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" /> {/* Filter */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-lg" /> {/* Actions */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardHeaderSkeleton;
