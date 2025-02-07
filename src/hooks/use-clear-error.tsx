import { useState } from "react";
import { debounce } from "@/utils/debounce";
import type { FormErrors } from "@/lib/types";

export default function useClearError<T>() {
  const [errors, setErrors] = useState<FormErrors<T>>({
    clientErrors: {} as Partial<Record<keyof T, string>>,
    serverError: "",
  });

  const clearError = debounce((name: keyof T) => {
    setErrors((prev) => {
      if (!prev.clientErrors[name] && !prev.serverError) return prev;

      return {
        ...prev,
        clientErrors: { ...prev.clientErrors, [name]: "" },
        serverError: "",
      };
    });
  }, 300);

  return { errors, setErrors, clearError };
}
