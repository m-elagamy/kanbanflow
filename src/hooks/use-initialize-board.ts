import { useLayoutEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import { useTaskStore } from "@/stores/task";
import { useTaskFilterStore } from "@/stores/task-filter";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import type { ClientTask } from "@/lib/types";

type BoardWithColumnsAndTasks = SimplifiedBoard & {
  columns: (SimplifiedColumn & {
    tasks: ClientTask[];
    totalCount: number;
    nextCursor: string | null;
  })[];
};

export function useInitializeBoardData(initialBoard: BoardWithColumnsAndTasks) {
  const { boards, setBoards, setActiveBoardId } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoards: state.setBoards,
      setActiveBoardId: state.setActiveBoardId,
    })),
  );
  const setBoardColumns = useColumnStore((state) => state.setColumns);
  const { columnPages, initializeTaskPages } = useTaskStore(
    useShallow((state) => ({
      columnPages: state.columnPages,
      initializeTaskPages: state.initializeTaskPages,
    })),
  );
  const setPriorityFilter = useTaskFilterStore(
    (state) => state.setPriorityFilter,
  );

  useLayoutEffect(() => {
    if (!initialBoard?.id) return;

    const { columns, ...boardData } = initialBoard;

    setBoards({ [initialBoard.id]: boardData });
    setActiveBoardId(initialBoard.id);
    setPriorityFilter("all");

    const columnsWithoutTasks = columns.map(({ id, status, order }) => ({
      id,
      status,
      order,
    }));

    setBoardColumns(initialBoard.id, columnsWithoutTasks);

    initializeTaskPages(
      columns.map((column) => ({
        columnId: column.id,
        tasks: column.tasks,
        totalCount: column.totalCount,
        nextCursor: column.nextCursor,
      })),
    );
  }, [
    initialBoard,
    setBoards,
    setBoardColumns,
    initializeTaskPages,
    setActiveBoardId,
    setPriorityFilter,
  ]);

  const activeBoard = boards[initialBoard.id] ?? null;
  const hasInitializedTaskPages =
    Boolean(activeBoard) &&
    initialBoard.columns.every((column) => Boolean(columnPages[column.id]));

  return { activeBoard, hasInitializedTaskPages };
}
