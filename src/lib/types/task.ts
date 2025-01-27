import type { AddTask } from "@/schemas/task";
import type { Priority } from "@prisma/client";
import type { z } from "zod";

export type Task = {
  id: string;
  columnId: string;
  order: number;
  title: string;
  description: string;
  priority: Priority;
  tag: string[];
};

export type CreateTaskActionState = {
  success: boolean;
  message: string;
  errors?: z.ZodFormattedError<Pick<AddTask, "title">>;
  fields?: Partial<AddTask> & { columnId?: string; taskId?: string };
  boardSlug?: string;
  isUpdating?: boolean;
};

export type EditTaskActionState = {
  success: boolean;
  message: string;
  errors?: z.ZodFormattedError<Pick<AddTask, "title">>;
  fields?: Partial<AddTask> & { columnId?: string; taskId?: string };
  boardSlug?: string;
  isUpdating?: boolean;
};
