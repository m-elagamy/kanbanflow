import { useState } from "react";
import type { FormErrors } from "@/lib/types";

export default function useClearError<T>() {
  const [errors, setErrors] = useState<FormErrors<T>>({
    clientErrors: {} as Partial<Record<keyof T, string>>,
    serverErrors: { specific: "", generic: "" },
  });

  const clearError = (field: keyof T) => {
    setErrors((prev) => {
      const { clientErrors, serverErrors } = prev;

      if (
        !clientErrors[field] &&
        !serverErrors.generic &&
        !serverErrors.specific
      )
        return prev;

      return {
        ...prev,
        clientErrors: { ...clientErrors, [field]: "" },
        serverErrors: { specific: "", generic: "" },
      };
    });
  };

  return { errors, setErrors, clearError };
}
