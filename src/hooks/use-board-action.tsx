import { boardSchema } from "@/schemas/board";
import getBoardAction from "@/utils/get-board-action";
import type {
  ActionMode,
  CreateBoardActionState,
  EditBoardActionState,
} from "@/lib/types";
import { useAction } from "./use-action";

type UseBoardAction = {
  initialState: CreateBoardActionState | EditBoardActionState;
  actionMode: ActionMode;
  modalId: string;
};

export function useBoardAction({
  initialState,
  actionMode,
  modalId,
}: UseBoardAction) {
  const fields =
    actionMode === "edit"
      ? ["title", "description"]
      : ["title", "description", "template"];
  const schema =
    actionMode === "edit" ? boardSchema.omit({ template: true }) : boardSchema;

  return useAction({
    initialState,
    actionMode,
    getAction: getBoardAction,
    schema,
    fields,
    modalType: "board",
    modalId,
  });
}
