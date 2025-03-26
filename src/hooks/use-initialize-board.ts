import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Task } from "@prisma/client";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import { useTaskStore } from "@/stores/task";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { SimplifiedBoard } from "@/lib/types/stores/board";

type BoardWithColumnsAndTasks = SimplifiedBoard & {
  columns: (SimplifiedColumn & { tasks: Task[] })[];
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
  const setTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    if (!initialBoard?.id) return;

    const { columns, ...boardData } = initialBoard;

    setBoards({ [initialBoard.id]: boardData });
    setActiveBoardId(initialBoard.id);

    const columnsWithoutTasks = columns.map(({ id, status, order }) => ({
      id,
      status,
      order,
    }));

    setBoardColumns(initialBoard.id, columnsWithoutTasks);

    const allTasks = columns.flatMap((column) => column.tasks);

    if (allTasks.length > 0) {
      setTasks(allTasks);
    }
  }, [initialBoard, setBoards, setBoardColumns, setTasks, setActiveBoardId]);

  const activeBoard = boards[initialBoard?.id] ?? null;

  return { activeBoard };
}
