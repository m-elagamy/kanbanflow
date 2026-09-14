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
};

export default function BoardLayout({
  initialBoard,
  linkedTask,
}: BoardLayoutProps) {
  const { activeBoard } = useInitializeBoardData(initialBoard);
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    if (linkedTask) {
      openModal("task", `linked-task-${linkedTask.id}`);
    }
  }, [linkedTask, openModal]);

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
