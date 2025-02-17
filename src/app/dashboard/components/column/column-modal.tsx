"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

import AddColumnCard from "./add-column-card";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import { getModalDescription } from "../../utils/get-modal-description";
import { getModalTitle } from "../../utils/get-modal-title";

const ColumnForm = dynamic(() => import("./column-form"), {
  loading: () => (
    <div className="flex h-[120px] items-center justify-center">
      <Loader size={18} className="animate-spin" />
    </div>
  ),
});

type ColumnModalProps = {
  boardId: string;
};

const ColumnModal = ({ boardId }: ColumnModalProps) => {
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
        <ColumnForm boardId={boardId} modalId={modalId} />
      </Modal>
    </>
  );
};

export default ColumnModal;
