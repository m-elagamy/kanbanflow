import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

type DALFunction<T extends unknown[], R> = (...args: T) => Promise<R>;
type DALResult<R> = { success: boolean; message: string; data?: R };

export function withUserId<T extends unknown[], R>(
  fn: DALFunction<[userId: string, ...args: T], R>,
): DALFunction<T, DALResult<R>> {
  return async (...args: T) => {
    const { userId } = await auth();
    if (!userId) unauthorized();
    const result = await fn(userId, ...args);
    return { success: true, message: "Authenticated", data: result };
  };
}

export function ensureAuthenticated<T extends unknown[], R>(
  fn: DALFunction<T, R>,
): DALFunction<T, DALResult<R>> {
  return async (...args: T) => {
    const { userId } = await auth();
    if (!userId) unauthorized();
    const result = await fn(...args);
    return { success: true, message: "Authenticated", data: result };
  };
}
