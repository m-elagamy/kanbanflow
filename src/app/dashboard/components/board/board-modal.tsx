"use client";

import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type {
  BoardSummary,
  ButtonVariants,
  FormMode,
  Templates,
} from "@/lib/types";
import BoardForm from "./board-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type BoardModalProps = {
  mode: FormMode;
  modalId: string;
  trigger?: React.ReactElement;
  board?: BoardSummary;
  variant?: ButtonVariants;
  defaultTemplate?: Templates;
  size?: "sm" | "default" | "lg" | "icon";
};

const BoardModal = ({
  mode,
  board,
  trigger,
  variant,
  modalId,
  defaultTemplate,
  size = "default",
}: BoardModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalIdToUse = modalId ?? `board-${board?.id}`;

  const handleOnClick = () => openModal("board", modalIdToUse);

  return (
    <>
      {trigger && (
        <Slot
          className={cn(buttonVariants({ variant, size, className: "group" }))}
          onClick={handleOnClick}
        >
          {trigger}
        </Slot>
      )}
      <Modal
        title={getModalTitle("board", mode)}
        description={getModalDescription("board", mode)}
        modalType="board"
        modalId={modalIdToUse}
      >
        <BoardForm
          formMode={mode}
          modalId={modalIdToUse}
          board={board}
          defaultTemplate={defaultTemplate}
        />
      </Modal>
    </>
  );
};

export default BoardModal;
