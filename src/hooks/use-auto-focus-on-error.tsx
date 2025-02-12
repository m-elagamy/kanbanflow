"use client";

import { useCallback, useEffect, type RefObject } from "react";
import type { ServerErrors } from "@/lib/types";
import isFocusable from "@/utils/focusable-element";

export default function useAutoFocusOnError<T>(
  errors: {
    clientErrors: Partial<Record<keyof T, string>>;
    serverErrors: ServerErrors;
  },
  formRef: RefObject<HTMLFormElement | null>,
) {
  const focusOnFirstError = useCallback(() => {
    if (!formRef.current) return;

    const firstErrorInput = formRef.current.querySelector<HTMLElement>(
      'input:invalid, select:invalid, textarea:invalid, [aria-invalid="true"], [data-state="error"]',
    );

    if (firstErrorInput && isFocusable(firstErrorInput)) {
      firstErrorInput.focus();
    }
  }, [formRef]);

  useEffect(() => {
    if (
      Object.values(errors.clientErrors).some(Boolean) ||
      errors.serverErrors.specific
    ) {
      focusOnFirstError();
    }
  }, [
    errors.clientErrors,
    errors.serverErrors.specific,
    formRef,
    focusOnFirstError,
  ]);
}
