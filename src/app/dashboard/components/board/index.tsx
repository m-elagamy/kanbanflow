"use client";

import { useEffect } from "react";
import { useInitializeBoardData } from "@/hooks/use-initialize-board";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { ClientTask } from "@/lib/types";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";
import BoardSkeleton from "./board-skeleton";
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
};

export default function BoardLayout({
  initialBoard,
  linkedTask,
  focusedTaskId,
}: BoardLayoutProps) {
  const { activeBoard, hasInitializedTaskPages } =
    useInitializeBoardData(initialBoard);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    if (!linkedTask || !activeBoard?.id) return;

    const modalId = `linked-task-${linkedTask.id}`;
    openModal("task", modalId);

    return () => closeModal("task", modalId);
  }, [activeBoard?.id, closeModal, linkedTask, openModal]);

  if (!activeBoard?.id || !hasInitializedTaskPages) {
    return (
      <BoardSkeleton
        columnsNumber={initialBoard.columns.length}
        hasDescription={Boolean(initialBoard.description)}
        tasksPerColumn={initialBoard.columns.map(
          (column) => column.tasks.length,
        )}
      />
    );
  }

  return (
    <BoardContainer>
      <BoardHeader board={activeBoard} />
      <ColumnsWrapper
        boardId={activeBoard.id}
        focusedTaskId={focusedTaskId}
      />
      {linkedTask && (
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
