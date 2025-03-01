import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import { useModalStore } from "@/stores/modal";
import { useShallow } from "zustand/react/shallow";

export const useBoardFormStore = () => {
  const {
    boards,
    createBoard,
    updateBoardId,
    updateBoard,
    deleteBoard,
    activeBoardId,
  } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      createBoard: state.createBoard,
      updateBoardId: state.updateBoardId,
      updateBoard: state.updateBoard,
      deleteBoard: state.deleteBoard,
      activeBoardId: state.activeBoardId,
      setActiveBoardId: state.setActiveBoardId,
    })),
  );

  const { columns, setColumns } = useColumnStore(
    useShallow((state) => ({
      columns: state.columns,
      setColumns: state.setColumns,
    })),
  );

  const closeModal = useModalStore((state) => state.closeModal);

  return {
    boards,
    createBoard,
    updateBoardId,
    updateBoard,
    deleteBoard,
    activeBoardId,
    columns,
    setColumns,
    closeModal,
  };
};
