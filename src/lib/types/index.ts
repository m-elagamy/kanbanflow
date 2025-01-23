import type { z } from "zod";
import type { BoardCreationForm } from "@/schemas/board";

export type CreateBoardActionState = {
  success: boolean;
  message: string;
  boardSlug?: string;
  errors?: z.ZodFormattedError<BoardCreationForm>;
  fields?: Partial<BoardCreationForm> & { boardId?: string };
};

export type EditBoardActionState = {
  success: boolean;
  message: string;
  boardSlug?: string;
  errors?: z.ZodFormattedError<
    Pick<BoardCreationForm, "title" | "description">
  >;
  fields?: Partial<BoardCreationForm> & { boardId?: string };
};

export type Mode = "create" | "edit";
