"use client";

import { useEffect, useRef } from "react";
import isElementFocusable from "@/utils/focusable-element";

type AutoFocusOnErrorOptions = {
  errorFieldSelectors?: string;
  delay?: number;
};

export default function useAutoFocusOnError<T>(
  fieldErrors: Partial<Record<keyof T, string>> | null,
  options: AutoFocusOnErrorOptions = {},
) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    errorFieldSelectors = 'input:invalid, select:invalid, textarea:invalid, [aria-invalid="true"], [data-state="error"]',
    delay = 0,
  } = options;

  useEffect(() => {
    if (
      !fieldErrors ||
      !Object.values(fieldErrors).some(Boolean) ||
      !formRef.current
    ) {
      return;
    }

    const firstInvalidField =
      formRef.current.querySelector<HTMLElement>(errorFieldSelectors);

    if (
      firstInvalidField &&
      isElementFocusable(firstInvalidField) &&
      document.activeElement !== firstInvalidField
    ) {
      if (delay > 0) {
        setTimeout(() => firstInvalidField.focus(), delay);
      } else {
        firstInvalidField.focus();
      }
    }
  }, [fieldErrors, formRef, errorFieldSelectors, delay]);

  return formRef;
}
