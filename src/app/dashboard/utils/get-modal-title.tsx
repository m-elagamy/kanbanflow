import type { formOperationMode } from "@/lib/types";
import type { ModalType } from "@/lib/types/modal";
import { CirclePlus, Edit, type LucideIcon } from "lucide-react";

const modalTitles: Record<
  ModalType,
  Record<formOperationMode, { icon: LucideIcon; text: string }>
> = {
  task: {
    create: { icon: CirclePlus, text: "New Task" },
    edit: { icon: Edit, text: "Edit Task" },
  },
  board: {
    create: { icon: CirclePlus, text: "New Board" },
    edit: { icon: Edit, text: "Edit Board" },
  },
  column: {
    create: { icon: CirclePlus, text: "New Column" },
    edit: { icon: Edit, text: "Edit Column" },
  },
};

export const getModalTitle = (type: ModalType, mode: formOperationMode) => {
  const { icon: Icon, text } = modalTitles[type]?.[mode] || {
    icon: null,
    text: "New Item",
  };
  return (
    <>
      {<Icon size={16} />}
      {text}
    </>
  );
};
