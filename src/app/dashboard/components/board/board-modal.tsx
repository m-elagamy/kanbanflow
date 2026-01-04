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
  modalId: string;
  trigger: React.ReactNode;
  board?: BoardSummary;
  variant?: ButtonVariants;
};

const BoardModal = ({
  mode,
  board,
  trigger,
  variant,
  modalId,
}: BoardModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalIdToUse = modalId ?? `board-${board?.id}`;

  const handleOnClick = () => openModal("board", modalIdToUse);

  return (
    <>
      <Button
        variant={variant}
        className="group"
        onClick={handleOnClick}
        size="lg"
        asChild
      >
        {trigger}
      </Button>
      <Modal
        title={getModalTitle("board", mode)}
        description={getModalDescription("board", mode)}
        modalType="board"
        modalId={modalIdToUse}
      >
        <BoardForm formMode={mode} modalId={modalIdToUse} board={board} />
      </Modal>
    </>
  );
};

export default BoardModal;
