"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

const Modal = ({
  title,
  description,
  children,
  open,
  onOpenChange,
  className = "",
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent
          className={`max-h-[calc(100dvh-2rem)] overflow-y-auto ${className}`}
        >
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
