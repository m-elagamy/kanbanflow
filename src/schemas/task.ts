import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task name must be at least 3 characters.")
    .max(50, "Task name must be less than 50 characters."),
  description: z.string().trim().max(2000, "Description too long.").optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium").optional(),
  dueDate: z
    .union([z.iso.date("Invalid date."), z.literal("")])
    .optional()
    .transform((value) => value || null),
});

export type TaskSchema = z.infer<typeof taskSchema>;

export const taskPositionSchema = z.object({
  taskId: z.string().min(1),
  oldColumnId: z.string().min(1),
  newColumnId: z.string().min(1),
  newTaskOrder: z.array(z.string().min(1)).min(1),
});

export type TaskPositionSchema = z.infer<typeof taskPositionSchema>;
