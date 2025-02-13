import { z } from "zod";

const columnStatusSchema = z.object({
  state: z.enum([
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

export default columnStatusSchema;
