"use client";

import { notFound } from "next/navigation";
import useActiveBoard from "@/hooks/use-active-board";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardContainer from "./board-container";

export default function OptimisticBoardLayout() {
  const { activeBoard, isDeleting } = useActiveBoard();

  if (!activeBoard) {
    if (isDeleting) return;
    notFound();
  }

  return (
    <BoardContainer>
      <BoardHeader board={activeBoard} />
      <ColumnsWrapper boardId={activeBoard.id} />
    </BoardContainer>
  );
}
