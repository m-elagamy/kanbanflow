import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";

export const useBoardFormStore = () => {
  const { updateBoard, activeBoardId } = useBoardStore(
    useShallow((state) => ({
      updateBoard: state.updateBoard,
      activeBoardId: state.activeBoardId,
    })),
  );

  return {
    updateBoard,
    activeBoardId,
  };
};
