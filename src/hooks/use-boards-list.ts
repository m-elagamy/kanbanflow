import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Board } from "@prisma/client";
import useBoardStore from "@/stores/board";

export function useBoardsList(
  initialBoards: Omit<Board, "userId" | "order">[],
) {
  const { boards, setBoards, activeBoardId, setActiveBoardId } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoards: state.setBoards,
      activeBoardId: state.activeBoardId,
      setActiveBoardId: state.setActiveBoardId,
    })),
  );

  /* 
   NOTE: Why do we need to set the initial value to true instead of false?
   If we set it to false, we can't have the loading indicator.
   If we set it to true, we can have the loading indicator.
   I think it's because we want to show the loading indicator when we first mount the component.
   If we set the initial value to false, the loading indicator will not show up.
  */
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialBoards) return;

    setBoards(
      Object.fromEntries(initialBoards.map((board) => [board.id, board])),
    );

    setIsLoading(false);
  }, [initialBoards, setBoards]);
  return {
    boards,
    activeBoardId,
    setActiveBoardId,
    isLoading,
  };
}
