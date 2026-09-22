"use client";

import { useEffect } from "react";
import { notFound, usePathname } from "next/navigation";
import useActiveBoard from "@/hooks/use-active-board";
import { useBoardCreation } from "@/hooks/use-board-creation";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardContainer from "./board-container";
import BoardErrorCard from "@/components/ui/board-error-card";

export default function OptimisticBoardLayout() {
  const pathname = usePathname();
  const { activeBoard } = useActiveBoard();
  const { hasError, isCreating, retryBoardCreation, navigateToDashboard } =
    useBoardCreation();

  useEffect(() => {
    window.history.replaceState(null, "", pathname);
  }, [pathname]);

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
