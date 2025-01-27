import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardForm from "./board-form";
import type { Board } from "@prisma/client";
import Modal from "@/components/ui/modal";
import { getInitialState } from "@/utils/board";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type BoardModalProps = {
  mode: "create" | "edit";
  board?: Pick<Board, "id" | "title" | "description">;
  trigger?: React.ReactNode;
};

const BoardModal = ({ mode, board, trigger }: BoardModalProps) => {
  const initialState = getInitialState(mode, board);
  const modalId = board ? `board-${board.id}` : "new-board";

  return (
    <Modal
      trigger={
        trigger || (
          <Button className="group">
            <PlusCircle className="transition-transform group-hover:rotate-90" />
            Create your first board
          </Button>
        )
      }
      title={getModalTitle("board", mode)}
      description={getModalDescription("board", mode)}
      modalType="board"
      modalId={modalId}
    >
      <BoardForm mode={mode} initialState={initialState} modalId={modalId} />
    </Modal>
  );
};

export default BoardModal;
