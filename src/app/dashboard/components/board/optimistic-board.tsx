"use client";

import { notFound } from "next/navigation";
import useActiveBoard from "@/hooks/use-active-board";
import { useBoardRetry } from "@/hooks/use-board-retry";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardContainer from "./board-container";

export default function OptimisticBoardLayout() {
  const { activeBoard } = useActiveBoard();
  const { hasError } = useBoardRetry();

  if (!activeBoard?.id) notFound();

  return (
    <BoardContainer>
      {hasError && (
        <div className="absolute inset-0 z-10 bg-background opacity-50 transition-opacity" />
      )}
      <BoardHeader board={activeBoard} />
      <ColumnsWrapper boardId={activeBoard.id} />
    </BoardContainer>
  );
}
