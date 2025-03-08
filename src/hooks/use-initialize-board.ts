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
  const { boards, setBoards, setActiveBoardId } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoards: state.setBoards,
      setActiveBoardId: state.setActiveBoardId,
    })),
  );
  const setBoardColumns = useColumnStore((state) => state.setColumns);
  const setColumnTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    if (!initialBoard) return;

    setActiveBoardId(initialBoard.id);
    setBoards({ [initialBoard.id]: initialBoard });
    setBoardColumns(initialBoard.columns);
    initialBoard.columns.forEach((column) => {
      if (column.tasks?.length) {
        setColumnTasks(column.id, column.tasks);
      }
    });

    return () => setActiveBoardId(null);
  }, [
    initialBoard,
    setActiveBoardId,
    setBoards,
    setBoardColumns,
    setColumnTasks,
  ]);

  const activeBoard = boards[initialBoard.id ?? ""];

  return { activeBoard };
}
