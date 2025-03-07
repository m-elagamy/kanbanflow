import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import useLoadingStore from "@/stores/loading";
import { useModalStore } from "@/stores/modal";

export const useBoardFormStore = () => {
  const {
    boards,
    createBoard,
    updateBoardId,
    updateBoard,
    activeBoardId,
    setError,
  } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      createBoard: state.createBoard,
      updateBoardId: state.updateBoardId,
      updateBoard: state.updateBoard,
      activeBoardId: state.activeBoardId,
      setError: state.setError,
    })),
  );

  const { isLoading, setIsLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading("board", "creating"),
      setIsLoading: state.setIsLoading,
    })),
  );

  const { setColumns } = useColumnStore(
    useShallow((state) => ({
      setColumns: state.setColumns,
    })),
  );

  const closeModal = useModalStore((state) => state.closeModal);

  return {
    boards,
    createBoard,
    updateBoardId,
    updateBoard,
    activeBoardId,
    setColumns,
    closeModal,
    isLoading,
    setIsLoading,
    setError,
  };
};
