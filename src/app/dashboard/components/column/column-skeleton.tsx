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
    ? tasksPerColumn.map((count) => (count === 0 ? 1 : Math.min(count, 3)))
    : Array(visibleColumns).fill(1);

  return (
    <div className="scrollbar-hide flex h-full gap-4 overflow-x-auto pb-4 md:justify-start">
      {Array.from({ length: visibleColumns }).map((_, columnIndex) => (
        <Card
          key={columnIndex}
          className="flex h-[500px] w-80 shrink-0 flex-col"
        >
          {/* Column Header */}
          <div className="flex min-h-[55px] items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" /> {/* Column status */}
              <Skeleton className="h-5 w-5 rounded-full" />
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
          <div className="flex-grow space-y-3 overflow-y-auto p-3">
            {Array.from({ length: taskCounts[columnIndex] }).map(
              (_, taskIndex) => (
                <Card
                  key={taskIndex}
                  className="min-h-[141px] p-3 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Task Title */}
                      <Skeleton className="h-4 w-[70%]" />
                      {/* Task Description */}
                      <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <Skeleton className="h-5 w-10 rounded-full" />
                    {/* Priority badge */}
                  </div>

                  {/* Task Footer */}
                  <div className="mt-3 flex items-center justify-end">
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-2 w-6 rounded-xl" />
                      {/* Ellipsis menu */}
                      <Skeleton className="h-3 w-12" /> {/* Date */}
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
