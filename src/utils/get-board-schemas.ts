import type { z } from "zod";
import { boardSchema } from "@/schemas/board";

const createBoardSchema = boardSchema.omit({ description: true });
const editBoardSchema = boardSchema.omit({ template: true, description: true });

type BoardCreateSchema = z.infer<typeof createBoardSchema>;
type BoardEditSchema = z.infer<typeof editBoardSchema>;

const BOARD_SCHEMAS = {
  create: createBoardSchema,
  edit: editBoardSchema,
};

export type BoardSchema = BoardCreateSchema | BoardEditSchema;
export default BOARD_SCHEMAS;
