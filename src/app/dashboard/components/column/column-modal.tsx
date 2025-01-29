"use client";

import { CirclePlus } from "lucide-react";
import AddColumnCard from "./add-column-card";
import ColumnForm from "./column-form";
import Modal from "@/components/ui/modal";

const ColumnModal = ({
  boardId,
  boardTitle,
}: {
  boardId: string;
  boardTitle: string;
}) => {
  const modalId = `new-column-${boardId}`;

  return (
    <Modal
      trigger={<AddColumnCard onClick={() => {}} />}
      title={
        <>
          <CirclePlus size={16} /> New Column
        </>
      }
      description="Pick a status for your new column like 'To Do' or 'In Progress' to keep your tasks organized."
      modalType="column"
      modalId={modalId}
    >
      <ColumnForm boardId={boardId} boardTitle={boardTitle} modalId={modalId} />
    </Modal>
  );
};

export default ColumnModal;
