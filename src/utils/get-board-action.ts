import { createBoardAction, updateBoardAction } from "@/actions/board";
import type {
  CreateBoardActionState,
  EditBoardActionState,
  ActionMode,
} from "@/lib/types";

export type BoardActionState = CreateBoardActionState | EditBoardActionState;

const getBoardAction = (mode: ActionMode) => {
  return (
    state: BoardActionState,
    formData: FormData,
  ): Promise<BoardActionState> => {
    if (mode === "create") {
      return createBoardAction(state as CreateBoardActionState, formData);
    } else {
      return updateBoardAction(state as EditBoardActionState, formData);
    }
  };
};

export default getBoardAction;
