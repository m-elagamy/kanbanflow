import ColumnSkeleton from "../column/column-skeleton";
import BoardHeaderSkeleton from "./board-header-skeleton";

type BoardSkeletonProps = {
  columnsNumber: number;
  tasksPerColumn: number[];
};

export default function BoardSkeleton({
  columnsNumber,
  tasksPerColumn,
}: BoardSkeletonProps) {
  return (
    <div
      className="flex h-full min-w-0 flex-col overflow-hidden"
      aria-label="Loading board"
      aria-busy="true"
    >
      <BoardHeaderSkeleton />
      <ColumnSkeleton
        columnsNumber={columnsNumber}
        tasksPerColumn={tasksPerColumn}
      />
    </div>
  );
}
