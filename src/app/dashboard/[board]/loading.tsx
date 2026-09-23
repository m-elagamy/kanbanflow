"use client";

import BoardContainer from "../components/board/board-container";
import BoardHeaderSkeleton from "../components/board/board-header-skeleton";
import BoardSkeleton from "../components/board/board-skeleton";
import { useSearchParams } from "next/navigation";

export default function BoardPageLoading() {
  const searchParams = useSearchParams();

  if (searchParams.get("new") !== "1") {
    return <BoardSkeleton columnsNumber={3} tasksPerColumn={[3, 2, 3]} />;
  }

  return (
    <BoardContainer>
      <BoardHeaderSkeleton />
      <div className="flex-1" aria-hidden="true" />
    </BoardContainer>
  );
}
