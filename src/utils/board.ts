import type { ActionMode } from "@/lib/types";
import { Board } from "@prisma/client";

export const getInitialState = (
  mode: ActionMode,
  board?: Pick<Board, "id" | "title" | "description">,
) => {
  return mode === "create"
    ? {
        success: false,
        message: "",
        errors: undefined,
        fields: {
          title: "",
          description: "",
          template: "",
        },
      }
    : {
        success: false,
        message: "",
        errors: undefined,
        fields: {
          boardId: board?.id,
          title: board?.title,
          description: board?.description,
        },
      };
};
