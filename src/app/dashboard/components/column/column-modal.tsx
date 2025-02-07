"use client";

import { CirclePlus } from "lucide-react";
import AddColumnCard from "./add-column-card";
import ColumnForm from "./column-form";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";

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
        title={
          <>
            <CirclePlus size={16} /> New Column
          </>
        }
        description="Pick a status for your new column like 'To Do' or 'In Progress' to keep your tasks organized."
        modalType="column"
        modalId={modalId}
      >
        <ColumnForm boardId={boardId} boardSlug={boardSlug} modalId={modalId} />
      </Modal>
    </>
  );
};

export default ColumnModal;
