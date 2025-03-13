import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";

const useActiveBoard = () => {
  const { activeBoardId, boards } = useBoardStore(
    useShallow((state) => ({
      activeBoardId: state.activeBoardId,
      boards: state.boards,
    })),
  );

  const activeBoard = activeBoardId ? boards[activeBoardId] : null;

  return { activeBoard };
};

export default useActiveBoard;
