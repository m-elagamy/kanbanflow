import { z } from "zod";

const columnStatusSchema = z.object({
  status: z.enum([
    "To Do",
    "In Progress",
    "Done",
    "Blocked",
    "On Hold",
    "Testing",
    "Under Review",
    "Cancelled",
    "Backlog",
    "Ready for Development",
    "Deployed",
    "Ready for Review",
  ]),
});

export type ColumnStatus = z.infer<typeof columnStatusSchema.shape.status>;

export default columnStatusSchema;
