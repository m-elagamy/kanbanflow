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
    ssr: false,
    loading: () => null,
  },
);

type ModalProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  modalType: "board" | "task" | "column";
  modalId: string;
};

const Modal = ({
  title,
  description,
  children,
  className,
  modalType,
  modalId,
}: ModalProps) => {
  const { modals, openModal, closeModal } = useModalStore();

  const modalKey = `${modalType}-${modalId}`;
  const isOpen = modals.has(modalKey);

  const handleOpen = () => {
    openModal(modalType, modalId);
  };

  const handleClose = () => {
    closeModal(modalType, modalId);
  };

  useEffect(() => {
    if (!isOpen) return;
    return () => closeModal(modalType, modalId);
  }, [isOpen, closeModal, modalType, modalId]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? handleOpen() : handleClose())}
    >
      {isOpen && (
        <DialogContent className={`rounded-lg ${className ?? ""}`}>
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
