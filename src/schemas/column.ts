import { z } from "zod";

const columnStatusSchema = z.object({
  status: z.enum([
    "To_Do",
    "In_Progress",
    "Done",
    "Blocked",
    "On_Hold",
    "Testing",
    "Under_Review",
    "Cancelled",
    "Backlog",
    "Ready_for_Development",
    "Deployed",
    "Ready_for_Review",
  ]),
});

export default columnStatusSchema;
