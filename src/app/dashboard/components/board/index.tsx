"use client";

import { useInitializeBoardData } from "@/hooks/use-initialize-board";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { ClientTask } from "@/lib/types";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardSkeleton from "./board-skeleton";
import BoardContainer from "./board-container";

type BoardLayoutProps = {
  initialBoard: SimplifiedBoard & {
    columns: (SimplifiedColumn & { tasks: ClientTask[] })[];
  };
};

export default function BoardLayout({ initialBoard }: BoardLayoutProps) {
  const { activeBoard } = useInitializeBoardData(initialBoard);

  if (!activeBoard?.id) {
    return (
      <BoardSkeleton
        columnsNumber={initialBoard.columns.length + 1}
        tasksPerColumn={initialBoard.columns.map(
          (column) => column.tasks.length,
        )}
      />
    );
  }

  return (
    <BoardContainer>
      <BoardHeader board={activeBoard} />
      <ColumnsWrapper boardId={activeBoard.id} />
    </BoardContainer>
  );
}
