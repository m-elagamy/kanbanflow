import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import { useTaskStore } from "@/stores/task";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import type { SimplifiedTask } from "@/lib/types/stores/task";

type BoardWithColumnsAndTasks = SimplifiedBoard & {
  columns: (SimplifiedColumn & { tasks: SimplifiedTask[] })[];
};

export function useInitializeBoardData(initialBoard: BoardWithColumnsAndTasks) {
  const { boards, setBoards } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoards: state.setBoards,
    })),
  );
  const setBoardColumns = useColumnStore((state) => state.setColumns);
  const setColumnTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    if (!initialBoard?.id) return;

    const { columns, ...boardData } = initialBoard;

    setBoards({ [initialBoard.id]: boardData });

    const columnsWithoutTasks = columns.map(({ id, status }) => ({
      id,
      status,
    }));

    setBoardColumns(initialBoard.id, columnsWithoutTasks);

    columns.forEach((column) => {
      if (column.tasks.length > 0) {
        setColumnTasks(column.id, column.tasks);
      }
    });
  }, [initialBoard, setBoards, setBoardColumns, setColumnTasks]);

  const activeBoard = boards[initialBoard?.id] ?? null;

  return { activeBoard };
}
