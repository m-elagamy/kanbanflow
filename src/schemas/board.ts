import { z } from "zod";

export const boardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Board name must be at least 3 characters." })
    .max(50, { message: "Board name must be less than 50 characters." })
    .refine((val) => /[a-zA-Z0-9]/.test(val), {
      message: "Board name must contain at least one letter or number.",
    }),
  template: z
    .enum(["personal", "agile", "bug-tracking", "custom"])
    .default("personal")
    .optional(),
  description: z
    .string()
    .max(500, { message: "Description too long." })
    .trim()
    .nullish()
    .optional(),
});

export type BoardFormSchema = z.infer<typeof boardSchema>;
