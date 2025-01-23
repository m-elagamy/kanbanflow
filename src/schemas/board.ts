import { z } from "zod";

export const boardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Board name must be at least 3 characters" })
    .max(50, { message: "Board name must be less than 50 characters" }),
  template: z.string().min(1, { message: "Please select a template" }),
  description: z.string().trim().optional().nullish(),
});

export type BoardCreationForm = z.infer<typeof boardSchema>;
