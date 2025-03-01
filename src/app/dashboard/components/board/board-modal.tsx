"use client";

import type { Board } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type { ButtonVariants } from "@/lib/types";

import BoardForm from "./board-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type BoardModalProps = {
  mode: "create" | "edit";
  board?: Pick<Board, "id" | "title" | "description" | "slug">;
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
        <BoardForm formMode={mode} modalId={modalId} board={board} />
      </Modal>
    </>
  );
};

export default BoardModal;
