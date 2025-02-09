"use client";

import { useEffect, RefObject } from "react";

export default function useAutoFocusOnError(
  errors: { clientErrors: Record<string, string>; serverError: string },
  inputRef: RefObject<HTMLInputElement | null>,
) {
  useEffect(() => {
    if (
      Object.values(errors.clientErrors).some(Boolean) ||
      errors.serverError
    ) {
      inputRef.current?.focus();
    }
  }, [errors.clientErrors, errors.serverError, inputRef]);
}
