import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";

const useActiveBoard = () => {
  const { activeBoardId, setActiveBoardId, boards, isDeleting } = useBoardStore(
    useShallow((state) => ({
      activeBoardId: state.activeBoardId,
      setActiveBoardId: state.setActiveBoardId,
      boards: state.boards,
      isDeleting: state.isDeleting,
    })),
  );

  const activeBoard = activeBoardId ? boards[activeBoardId] : undefined;

  useEffect(() => {
    return () => setActiveBoardId(null);
  }, [setActiveBoardId]);

  return { activeBoard, isDeleting };
};

export default useActiveBoard;
