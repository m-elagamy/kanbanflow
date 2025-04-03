import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Task name must be at least 3 characters.")
    .max(50, "Task name must be less than 50 characters."),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium").optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
