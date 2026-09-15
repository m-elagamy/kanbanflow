import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ColumnSkeletonProps = {
  columnsNumber: number;
  tasksPerColumn: number[];
};

export default function ColumnSkeleton({
  columnsNumber,
  tasksPerColumn,
}: ColumnSkeletonProps) {
  const visibleColumns = Math.min(columnsNumber, 4);

  const taskCounts = tasksPerColumn
    ? tasksPerColumn.map((count) => (count === 0 ? 0 : Math.min(count, 3)))
    : Array(visibleColumns).fill(1);

  return (
    <div className="scrollbar-thumb-border flex h-full snap-x snap-proximity gap-3 overflow-x-auto px-3 pb-4 sm:gap-4 sm:px-4 md:justify-start">
      {Array.from({ length: visibleColumns }).map((_, columnIndex) => (
        <Card
          key={columnIndex}
          className="border-border/80 bg-muted/45 dark:bg-muted/35 relative h-full min-h-0 max-h-[calc(100dvh-82px)] w-[calc(100vw-4.5rem)] max-w-72 shrink-0 snap-start gap-0 overflow-hidden rounded-xl border py-0 shadow-sm md:w-84 md:max-w-none"
        >
          <div className="flex min-h-14 items-center justify-between border-b p-4 pb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-7 rounded-md" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>

          <div className="grow space-y-2.5 overflow-hidden p-3">
            {Array.from({ length: taskCounts[columnIndex] }).map(
              (_, taskIndex) => (
                <Card
                  key={taskIndex}
                  className="border-border/80 bg-card min-h-24 gap-0 rounded-lg p-3 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/5" />
                        {taskIndex % 2 === 0 && (
                          <>
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                          </>
                        )}
                      </div>
                      <Skeleton className="size-7 rounded-md" />
                    </div>
                    <div className="flex min-h-5 items-center justify-between gap-3">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="size-4 rounded-sm" />
                    </div>
                  </div>
                </Card>
              ),
            )}
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </Card>
      ))}
      <div className="bg-background/50 flex h-14 w-64 min-w-64 shrink-0 snap-start items-center justify-center gap-2 rounded-xl border border-dashed px-4 md:w-84 md:min-w-84">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
