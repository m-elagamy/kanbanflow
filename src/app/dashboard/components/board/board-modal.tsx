"use client";

import { Button } from "@/components/ui/button";
import BoardForm from "./board-form";
import type { Board } from "@prisma/client";
import Modal from "@/components/ui/modal";
import { getInitialState } from "@/utils/board";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";
import { useModalStore } from "@/stores/modal";
import type { ButtonVariants } from "@/lib/types";

type BoardModalProps = {
  mode: "create" | "edit";
  board?: Pick<Board, "id" | "title" | "description">;
  trigger: React.ReactNode;
  variant?: ButtonVariants;
};

const BoardModal = ({ mode, board, trigger, variant }: BoardModalProps) => {
  const initialState = getInitialState(mode, board);

  const openModal = useModalStore((state) => state.openModal);

  const modalId = board ? `board-${board.id}` : "new-board";

  const handleOnClick = () => openModal("board", modalId);

  return (
    <>
      <Button
        variant={variant}
        className="group !h-8"
        onClick={handleOnClick}
        asChild
      >
        {trigger}
      </Button>
      <Modal
        title={getModalTitle("board", mode)}
        description={getModalDescription("board", mode)}
        modalType="board"
        modalId={modalId}
      >
        <BoardForm mode={mode} initialState={initialState} modalId={modalId} />
      </Modal>
    </>
  );
};

export default BoardModal;
