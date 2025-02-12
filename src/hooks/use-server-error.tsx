import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { ActionStateResponse, FormErrors } from "@/lib/types";

export function useServerError<T>(
  state: ActionStateResponse,
  setErrors: Dispatch<SetStateAction<FormErrors<T>>>,
  requestId: number,
): void {
  useEffect(() => {
    if (!state.success && state.message) {
      setErrors((prev) => ({
        ...prev,
        serverErrors: {
          specific: state.message ?? "",
          generic: "",
        },
      }));
    }
  }, [state.success, state.message, setErrors, requestId]);
}
