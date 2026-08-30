import BoardSkeleton from "../components/board/board-skeleton";

export default function BoardPageLoading() {
  return <BoardSkeleton columnsNumber={3} tasksPerColumn={[3, 2, 3]} />;
}
