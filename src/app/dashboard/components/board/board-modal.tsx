"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type { BoardSummary, ButtonVariants, FormMode } from "@/lib/types";
import BoardForm from "./board-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type BoardModalProps = {
  mode: FormMode;
  board?: BoardSummary;
  trigger: React.ReactNode;
  variant?: ButtonVariants;
};

const BoardModal = ({ mode, board, trigger, variant }: BoardModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalId = board ? `board-${board.id}` : "new-board";

  const handleOnClick = () => openModal("board", modalId);

  return (
    <>
      <Button
        variant={variant}
        className="group"
        onClick={handleOnClick}
        size="sm"
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
        <BoardForm formMode={mode} modalId={modalId} board={board} />
      </Modal>
    </>
  );
};

export default BoardModal;
