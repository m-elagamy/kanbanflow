"use client";

import type { Task } from "@prisma/client";
import { useInitializeBoardData } from "@/hooks/use-initialize-board";
import type { BoardView } from "@/lib/types/stores/board";
import type { ColumnView } from "@/lib/types/stores/column";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardSkeleton from "./board-skeleton";
import BoardContainer from "./board-container";

type BoardLayoutProps = {
  initialBoard: BoardView & {
    columns: (ColumnView & { tasks: Task[] })[];
  };
};

export default function BoardLayout({ initialBoard }: BoardLayoutProps) {
  const { activeBoard } = useInitializeBoardData(initialBoard);

  if (!activeBoard) {
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
