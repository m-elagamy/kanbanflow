import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import type { Board } from "@prisma/client";
import useBoardStore from "@/stores/board";

export function useBoardsList(
  initialBoards: Omit<Board, "userId" | "order">[],
) {
  const pathname = usePathname();

  const { boards, setBoards, activeBoardId, setActiveBoardId } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoards: state.setBoards,
      activeBoardId: state.activeBoardId,
      setActiveBoardId: state.setActiveBoardId,
    })),
  );

  const isActiveBoard = (boardSlug: string) => {
    return decodeURIComponent(pathname) === `/dashboard/${boardSlug}`;
  };

  const initialBoardsMap = useMemo(
    () => Object.fromEntries(initialBoards.map((board) => [board.id, board])),
    [initialBoards],
  );

  useEffect(() => {
    setBoards(initialBoardsMap);
  }, [initialBoardsMap, setBoards]);

  const isLoading =
    initialBoards.length > 0 && Object.keys(boards).length === 0;
  return {
    boards,
    activeBoardId,
    setActiveBoardId,
    isLoading,
    isActiveBoard,
  };
}
