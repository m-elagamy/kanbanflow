"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal";

type ModalProps = {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  modalType: "board" | "task" | "column";
  modalId: string;
};

const Modal = ({
  trigger,
  title,
  description,
  children,
  className,
  modalType,
  modalId,
}: ModalProps) => {
  const { openModals, openModal, closeModal } = useModalStore();

  const isOpen = openModals[modalType][modalId] || false;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        open ? openModal(modalType, modalId) : closeModal(modalType, modalId)
      }
    >
      <DialogTrigger asChild className={`${className ?? ""}`}>
        {trigger}
      </DialogTrigger>
      <DialogContent className={`rounded-lg ${className ?? ""}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
