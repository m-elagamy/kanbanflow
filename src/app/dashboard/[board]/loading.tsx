import BoardSkeleton from "../components/board/board-skeleton";

// Real column/task counts aren't known yet at this point in the route —
// this generic shape matches what BoardLayout falls back to client-side
// while the store hydrates (see components/board/index.tsx).
export default function BoardPageLoading() {
  return <BoardSkeleton columnsNumber={3} tasksPerColumn={[3, 2, 3]} />;
}
