"use client";

import { ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal";

const DialogContent = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.DialogContent),
  {
    loading: () => null,
  },
);

type ModalProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  modalType: "board" | "task" | "column";
  modalId: string;
  className?: string;
};

const Modal = ({
  title,
  description,
  children,
  modalType,
  modalId,
  className = "",
}: ModalProps) => {
  const { modals, openModal, closeModal } = useModalStore();
  const modalKey = `${modalType}-${modalId}`;
  const shouldDisplayModal = modals.has(modalKey);

  const handleOpen = () => openModal(modalType, modalId);
  const handleClose = () => closeModal(modalType, modalId);

  useEffect(() => {
    return () => {
      if (shouldDisplayModal) {
        closeModal(modalType, modalId);
      }
    };
  }, [modalType, modalId, closeModal, shouldDisplayModal]);

  return (
    <Dialog
      open={shouldDisplayModal}
      onOpenChange={(isOpen) => (isOpen ? handleOpen() : handleClose())}
    >
      {shouldDisplayModal && (
        <DialogContent className={`rounded-lg ${className}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Modal;
