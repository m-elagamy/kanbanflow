import { createBoardAction, updateBoardAction } from "@/actions/board";
import type {
  CreateBoardActionState,
  EditBoardActionState,
  Mode,
} from "@/lib/types";

type BoardActionState = CreateBoardActionState | EditBoardActionState;

const getBoardAction = (mode: Mode) => {
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
