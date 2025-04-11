import { Prisma } from "@prisma/client";

export default function handlePrismaError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return `A record with this unique field already exists.`;
    }
  }

  return "An unexpected database error occurred.";
}
