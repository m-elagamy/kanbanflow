import { createBoardAction, updateBoardAction } from "@/actions/board";
import { createTaskAction, updateTaskAction } from "@/actions/task";

const getFormActions = (isEditMode: boolean) => {
  return {
    taskAction: isEditMode ? updateTaskAction : createTaskAction,
    boardAction: isEditMode ? updateBoardAction : createBoardAction,
  };
};

export default getFormActions;
