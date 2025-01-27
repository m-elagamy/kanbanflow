import type { ActionMode, ModalType } from "@/lib/types";
import { CirclePlus, Edit, type LucideIcon } from "lucide-react";

const modalTitles: Record<
  ModalType,
  Record<ActionMode, { icon: LucideIcon; text: string }>
> = {
  task: {
    create: { icon: CirclePlus, text: "New Task" },
    edit: { icon: Edit, text: "Edit Task" },
  },
  board: {
    create: { icon: CirclePlus, text: "New Board" },
    edit: { icon: Edit, text: "Edit Board" },
  },
};

export const getModalTitle = (type: ModalType, mode: ActionMode) => {
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
