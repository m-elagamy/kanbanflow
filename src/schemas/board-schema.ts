import { z } from "zod";

const boardSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Board name must be at least 3 characters" })
    .max(50, { message: "Board name must be less than 50 characters" }),
  description: z.string().optional(),
  template: z.string().min(1, { message: "Please select a template" }),
});

export default boardSchema;
