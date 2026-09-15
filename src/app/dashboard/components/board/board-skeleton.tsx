import ColumnSkeleton from "../column/column-skeleton";
import BoardContainer from "./board-container";
import BoardHeaderSkeleton from "./board-header-skeleton";

type BoardSkeletonProps = {
  columnsNumber: number;
  tasksPerColumn: number[];
  hasDescription?: boolean;
};

export default function BoardSkeleton({
  columnsNumber,
  tasksPerColumn,
  hasDescription = false,
}: BoardSkeletonProps) {
  return (
    <BoardContainer>
      <BoardHeaderSkeleton hasDescription={hasDescription} />
      <ColumnSkeleton
        columnsNumber={columnsNumber}
        tasksPerColumn={tasksPerColumn}
      />
    </BoardContainer>
  );
}
