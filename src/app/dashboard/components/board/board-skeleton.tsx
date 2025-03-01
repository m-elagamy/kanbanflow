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
    <div className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-0 md:px-4">
      <BoardHeaderSkeleton />
      <ColumnSkeleton
        columnsNumber={columnsNumber}
        tasksPerColumn={tasksPerColumn}
      />
    </div>
  );
}
