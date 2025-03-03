"use client";

import type { Board, Column, Task } from "@prisma/client";
import { useInitializeBoardData } from "@/hooks/use-initialize-board";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardSkeleton from "./board-skeleton";
import BoardContainer from "./board-container";

type BoardLayoutProps = {
  initialBoard: Omit<Board, "userId" | "order"> & {
    columns: (Omit<Column, "order"> & { tasks: Task[] })[];
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
