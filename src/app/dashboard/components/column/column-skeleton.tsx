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
    <div className="scrollbar-hide flex h-full gap-4 overflow-x-auto pb-4 md:justify-start">
      {Array.from({ length: visibleColumns }).map((_, columnIndex) => (
        <Card
          key={columnIndex}
          className="bg-background flex h-[500px] w-72 shrink-0 flex-col gap-0 p-0 md:w-96"
        >
          {/* Column Header */}
          <div className="flex min-h-[55px] items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />{" "}
              {/* Status circle */}
              <Skeleton className="h-4 w-24" /> {/* Column status */}
              <Skeleton className="h-5 w-5 rounded-md" />
              {/* Task count badge */}
            </div>
            <div className="flex items-center gap-4">
              {tasksPerColumn[columnIndex] >= 1 && (
                <Skeleton className="size-6 rounded-full" />
              )}
              {/* Plus icon */}
              <Skeleton className="size-6 rounded-full" /> {/* Ellipsis icon */}
            </div>
          </div>

          {/* Tasks Container */}
          <div className="grow space-y-3 overflow-y-auto p-3">
            {Array.from({ length: taskCounts[columnIndex] }).map(
              (_, taskIndex) => (
                <Card
                  key={taskIndex}
                  className="dark:bg-card min-h-[120px] rounded-lg bg-white p-3 shadow-sm"
                >
                  <div className="space-y-2.5">
                    {/* Task Title and Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      {/* Priority badge */}
                    </div>

                    {/* Task Description */}
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[80%]" />

                    {/* Task Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-12" /> {/* Date */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        {/* Avatar */}
                        <Skeleton className="h-5 w-5 rounded" />
                        {/* Actions */}
                      </div>
                    </div>
                  </div>
                </Card>
              ),
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
