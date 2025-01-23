import { useActionState, useEffect, useRef, useState } from "react";
import { debounce } from "@/utils/debounce";
import type {
  CreateBoardActionState,
  EditBoardActionState,
  Mode,
} from "@/lib/types";
import getBoardAction from "@/utils/get-board-action";

type UseBoardAction = {
  initialState: CreateBoardActionState | EditBoardActionState;
  mode: Mode;
};

export function useBoardAction({ initialState, mode }: UseBoardAction) {
  const [state, formAction, isPending] = useActionState(
    getBoardAction(mode),
    initialState,
  );

  const [validationErrors, setValidationErrors] =
    useState<CreateBoardActionState["errors"]>(undefined);
  const [errorMessage, setErrorMessage] = useState<
    CreateBoardActionState["message"] | null
  >(null);

  const titleRef = useRef<HTMLInputElement>(null);
  if (validationErrors?.title || (state.message && !validationErrors)) {
    titleRef.current?.focus();
  }

  const clearError = debounce((field: "title" | "template") => {
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
