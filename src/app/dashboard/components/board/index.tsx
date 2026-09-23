"use client";

import { useEffect } from "react";
import { useInitializeBoardData } from "@/hooks/use-initialize-board";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { ClientTask } from "@/lib/types";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardContainer from "./board-container";
import TaskModal from "../task/task-modal";
import { useModalStore } from "@/stores/modal";

type BoardLayoutProps = {
  initialBoard: SimplifiedBoard & {
    columns: (SimplifiedColumn & {
      tasks: ClientTask[];
      totalCount: number;
      nextCursor: string | null;
    })[];
  };
  linkedTask?: ClientTask | null;
  focusedTaskId?: string;
  animateEntry?: boolean;
};

export default function BoardLayout({
  initialBoard,
  linkedTask,
  focusedTaskId,
  animateEntry = false,
}: BoardLayoutProps) {
  const { activeBoard } = useInitializeBoardData(initialBoard);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    if (animateEntry)
      window.history.replaceState(null, "", window.location.pathname);
  }, [animateEntry]);

  useEffect(() => {
    if (!linkedTask || !activeBoard?.id) return;

    const modalId = `linked-task-${linkedTask.id}`;
    openModal("task", modalId);

    return () => closeModal("task", modalId);
  }, [activeBoard?.id, closeModal, linkedTask, openModal]);

  const board = activeBoard ?? initialBoard;

  return (
    <BoardContainer>
      <BoardHeader board={board} />
      <ColumnsWrapper
        boardId={board.id}
        focusedTaskId={focusedTaskId}
        animateEntry={animateEntry}
        initialColumns={initialBoard.columns}
      />
      {linkedTask && board.id && (
        <TaskModal
          mode="edit"
          task={linkedTask}
          columnId={linkedTask.columnId}
          modalId={`linked-task-${linkedTask.id}`}
        />
      )}
    </BoardContainer>
  );
}
