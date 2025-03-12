import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

type DALFunction<T extends unknown[], R> = (...args: T) => Promise<R>;
type DALResult<R> = { success: boolean; message: string; data?: R };

export default function withAuth<T extends unknown[], R>(
  dalFunction: DALFunction<T, R>,
): (...args: T) => Promise<DALResult<R>> {
  return async (...args: T): Promise<DALResult<R>> => {
    const { userId } = await auth();

    if (!userId) unauthorized();

    return {
      success: true,
      message: "User is authenticated",
      data: await dalFunction(...args),
    };
  };
}
