import type { formOperationMode, ModalType } from "@/lib/types";

export const getModalDescription = (
  type: ModalType,
  mode: formOperationMode,
) => {
  const descriptions: Record<ModalType, Record<formOperationMode, string>> = {
    board: {
      create: "Set up your board with a name, description, and template.",
      edit: "Modify the board details below.",
    },
    task: {
      create:
        "Create a task to outline your work and track progress effortlessly.",
      edit: "Refine your task details to better align with your goals.",
    },
  };
  return descriptions[type]?.[mode] || "";
};
