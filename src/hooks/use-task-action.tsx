import { useActionState, useEffect, useRef, useState } from "react";
import { debounce } from "@/utils/debounce";

import type {
  CreateTaskActionState,
  EditTaskActionState,
} from "@/lib/types/task";
import type { Mode } from "@/lib/types";
import getTaskAction from "@/utils/get-task-action";

type UseTaskAction = {
  initialState: CreateTaskActionState | EditTaskActionState;
  mode: Mode;
};

export function useTaskAction({ initialState, mode }: UseTaskAction) {
  const [state, formAction, isPending] = useActionState(
    getTaskAction(mode),
    initialState,
  );

  const [validationErrors, setValidationErrors] =
    useState<CreateTaskActionState["errors"]>(undefined);
  const [errorMessage, setErrorMessage] = useState<
    CreateTaskActionState["message"] | null
  >(null);

  const titleRef = useRef<HTMLInputElement>(null);
  if (validationErrors?.title || (state.message && !validationErrors)) {
    titleRef.current?.focus();
  }

  const clearError = debounce((field: string) => {
    setValidationErrors((prevErrors) => {
      if (prevErrors) {
        return { ...prevErrors, [field]: "" };
      }
      return prevErrors;
    });
    setErrorMessage(null);
  }, 300);

  useEffect(() => {
    setValidationErrors(state.errors);
    setErrorMessage(state.message);
  }, [state.errors, state]);

  return {
    state,
    formAction,
    isPending,
    titleRef,
    clearError,
    validationErrors,
    errorMessage,
  };
}
