import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { FormErrors } from "@/lib/types";

export function useServerError<T extends FormErrors<T>>(
  state: { success: boolean; message: string },
  setErrors: Dispatch<SetStateAction<FormErrors<T>>>,
  requestId: number,
): void {
  useEffect(() => {
    if (!state.success && state.message) {
      setErrors((prev) => ({
        ...prev,
        serverError: state.message ?? "",
      }));
    }
  }, [state.success, state.message, setErrors, requestId]);
}
