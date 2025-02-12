import BOARD_SCHEMAS from "./get-board-schemas";
import { taskSchema } from "@/schemas/task";

const getFormSchema = (isEditMode: boolean) => {
  const schemas = {
    boardSchema: isEditMode ? BOARD_SCHEMAS.edit : BOARD_SCHEMAS.create,
    taskSchema,
  };

  return schemas;
};

export default getFormSchema;
