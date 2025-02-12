"use client";

import { useActionState, useEffect, useState } from "react";

import { ActionStateResponse, type BoardActionState } from "@/lib/types";
import { type BoardFormSchema } from "@/schemas/board";

import useModalClose from "./use-modal-close";
import useForm from "./use-form";

type UseBoardActionProps = {
  initialState: BoardActionState;
  isEditMode: boolean;
  modalId: string;
};

export type BoardFormWithoutDescription = Omit<BoardFormSchema, "description">;

export default function useBoardAction({
  initialState,
  isEditMode,
  modalId,
}: UseBoardActionProps) {
  const [actionResponse, setActionResponse] = useState<ActionStateResponse>({
    success: false,
    message: "",
  });

  const {
    actions,
    formData: boardFormData,
    handleAction,
    clearError,
    errors,
    formRef,
    handleFieldChange,
    isInvalid: isFormInvalid,
    schemas,
  } = useForm<BoardFormSchema>({
    initialState: {
      title: initialState.fields?.title ?? "",
      description: initialState.fields?.description ?? "",
      template: initialState.fields?.template ?? "",
    },
    isEditMode,
    state: actionResponse,
  });

  const [actionState, formAction, isPending] = useActionState(
    actions.boardAction,
    {
      success: false,
      message: "",
    },
  );

  useModalClose({ success: actionResponse.success }, "board", modalId);

  const resetValues = {
    title: "",
    description: null,
    template: "",
  };

  const handleBoardAction = (formData: FormData) => {
    handleAction(formData, schemas.boardSchema, formAction, resetValues);
  };

  useEffect(() => {
    setActionResponse({
      success: actionState.success ?? false,
      message: actionState.message ?? "",
    });
  }, [actionState.success, actionState.message]);

  return {
    handleAction: handleBoardAction,
    state: actionState,
    isPending,
    isFormInvalid,
    formRef,
    boardFormData,
    errors,
    clearError,
    handleFieldChange,
  };
}
