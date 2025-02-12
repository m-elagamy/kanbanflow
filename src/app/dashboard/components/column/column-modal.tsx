"use client";

import AddColumnCard from "./add-column-card";
import ColumnForm from "./column-form";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import { getModalDescription } from "../../utils/get-modal-description";
import { getModalTitle } from "../../utils/get-modal-title";

type ColumnModalProps = {
  boardId: string;
  boardSlug: string;
};

const ColumnModal = ({ boardId, boardSlug }: ColumnModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalId = `new-column-${boardId}`;

  const handleOnClick = () => openModal("column", modalId);

  return (
    <>
      <AddColumnCard onClick={handleOnClick} />
      <Modal
        title={getModalTitle("column", "create")}
        description={getModalDescription("column", "create")}
        modalType="column"
        modalId={modalId}
      >
        <ColumnForm boardId={boardId} boardSlug={boardSlug} modalId={modalId} />
      </Modal>
    </>
  );
};

export default ColumnModal;
