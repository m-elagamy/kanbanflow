import { useState } from "react";
import { FormErrors } from "@/lib/types";

export default function useErrorManagement<T>() {
  const [errors, setErrors] = useState<FormErrors<T> | null>(null);

  const setSpecificError = (field: keyof T, message: string | undefined) => {
    setErrors((prev) => {
      if (prev?.[field] !== message) {
        return { ...prev, [field]: message } as FormErrors<T>;
      }
      return prev;
    });
  };

  const setGenericError = (message: string) => {
    setErrors((prev) => {
      if (prev?.generic !== message) {
        return { ...prev, generic: message } as FormErrors<T>;
      }
      return prev;
    });
  };

  const clearFieldError = (field: keyof T) => {
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }) as FormErrors<T>);
    }
  };

  const clearGenericError = () => {
    if (errors?.generic) {
      setErrors((prev) => ({ ...prev, generic: "" }) as FormErrors<T>);
    }
  };

  return {
    errors,
    setSpecificError,
    setGenericError,
    clearFieldError,
    clearGenericError,
  };
}
