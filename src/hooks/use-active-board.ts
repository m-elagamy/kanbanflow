import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";

const useActiveBoard = () => {
  const { activeBoardId, setActiveBoardId, boards } = useBoardStore(
    useShallow((state) => ({
      activeBoardId: state.activeBoardId,
      setActiveBoardId: state.setActiveBoardId,
      boards: state.boards,
    })),
  );

  const activeBoard = activeBoardId ? boards[activeBoardId] : undefined;

  useEffect(() => {
    return () => setActiveBoardId(null);
  }, [setActiveBoardId]);

  return { activeBoard };
};

export default useActiveBoard;
