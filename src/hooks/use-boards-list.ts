import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Board } from "@prisma/client";
import useBoardStore from "@/stores/board";

export function useBoardsList(
  initialBoards: Omit<Board, "userId" | "order">[],
) {
  const {
    boards,
    setBoards,
    activeBoardId,
    setActiveBoardId,
    isLoading,
    setIsLoading,
  } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoards: state.setBoards,
      activeBoardId: state.activeBoardId,
      setActiveBoardId: state.setActiveBoardId,
      isLoading: state.isLoading,
      setIsLoading: state.setIsLoading,
    })),
  );

  useEffect(() => {
    if (!initialBoards) return;

    setBoards(
      Object.fromEntries(initialBoards.map((board) => [board.id, board])),
    );

    setIsLoading(false);
  }, [initialBoards, setBoards, setIsLoading]);
  return { boards, activeBoardId, setActiveBoardId, isLoading };
}
