"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { createBoardAction, updateBoardAction } from "@/actions/board";
import validateFormData from "@/app/dashboard/utils/validate-form-data";
import type { BoardActionState } from "@/lib/types";
import { boardSchema, type BoardFormSchema } from "@/schemas/board";
import checkFormErrors from "@/app/dashboard/utils/check-form-errors";
import processFormData from "@/app/dashboard/utils/process-form-data";
import handleValidationErrors from "@/app/dashboard/utils/handle-validation-errors";

import useAutoFocusOnError from "./use-auto-focus-on-error";
import useClearError from "./use-clear-error";

type UseBoardActionProps = {
  initialState: BoardActionState;
  isEditMode: boolean;
};

export type BoardFormWithoutDescription = Omit<BoardFormSchema, "description">;
type BoardFormWithoutTemplate = Omit<BoardFormSchema, "template">;

const BOARD_SCHEMAS = {
  create: boardSchema.omit({ description: true }),
  edit: boardSchema.omit({ template: true, description: true }),
} as const;

export default function useBoardAction({
  initialState,
  isEditMode,
}: UseBoardActionProps) {
  const schema = isEditMode ? BOARD_SCHEMAS.edit : BOARD_SCHEMAS.create;

  const inputRef = useRef<HTMLInputElement>(null);
  const [requestId, setRequestId] = useState(0);

  const { errors, setErrors, clearError } =
    useClearError<BoardFormWithoutDescription>();

  useAutoFocusOnError(errors, inputRef);

  const isFormInvalid = checkFormErrors(errors);

  const [state, formAction, isPending] = useActionState(
    isEditMode ? updateBoardAction : createBoardAction,
    {
      success: false,
      message: "",
    },
  );

  const [boardFormData, setBoardFormData] = useState<BoardFormWithoutTemplate>({
    title: initialState.fields?.title ?? "",
    description: initialState.fields?.description ?? "",
  });

  const handleAction = (formData: FormData) => {
    const processedData = processFormData(formData);

    const validationResult = validateFormData(formData, schema);

    if (!validationResult.success) {
      handleValidationErrors(
        validationResult.error.flatten().fieldErrors,
        setErrors,
      );
      setBoardFormData(processedData as BoardFormWithoutTemplate);
      return;
    }

    setRequestId((prev) => prev + 1);

    formAction(formData);

    setBoardFormData({
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    if (!state.success && state.message) {
      setErrors((prev) => ({
        ...prev,
        serverError: state.message ?? "",
      }));
    }
  }, [state.success, state.message, setErrors, requestId]);

  return {
    handleAction,
    state,
    isPending,
    isFormInvalid,
    inputRef,
    boardFormData,
    errors,
    clearError,
  };
}
