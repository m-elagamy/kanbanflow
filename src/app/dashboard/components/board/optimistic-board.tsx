"use client";

import { notFound } from "next/navigation";
import useActiveBoard from "@/hooks/use-active-board";
import { useBoardRetry } from "@/hooks/use-board-retry";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardContainer from "./board-container";
import BoardErrorCard from "@/components/ui/board-error-card";

export default function OptimisticBoardLayout() {
  const { activeBoard } = useActiveBoard();
  const { hasError, isCreating, retryBoardCreation, navigateToDashboard } =
    useBoardRetry();

  if (hasError) {
    return (
      <BoardErrorCard
        onRetry={retryBoardCreation}
        onBack={navigateToDashboard}
        isPending={isCreating}
      />
    );
  }

  if (!activeBoard?.id) notFound();

  return (
    <BoardContainer>
      <BoardHeader board={activeBoard} />
      <ColumnsWrapper boardId={activeBoard.id} />
    </BoardContainer>
  );
}
