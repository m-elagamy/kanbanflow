import { useActionState, useEffect, useState } from "react";

import type { ActionStateResponse, TaskActionState } from "@/lib/types";
import { type TaskSchema } from "@/schemas/task";

import useModalClose from "./use-modal-close";
import useForm from "./use-form";

type UseTaskActionProps = {
  initialState: TaskActionState;
  isEditMode: boolean;
  modalId: string;
};

export default function useTaskAction({
  initialState,
  isEditMode,
  modalId,
}: UseTaskActionProps) {
  const [state, setState] = useState<ActionStateResponse>({
    success: false,
    message: "",
  });

  const {
    actions,
    formData: taskFormData,
    handleAction,
    clearError,
    errors,
    formRef,
    handleFieldChange,
    isInvalid: isFormInvalid,
    schemas,
  } = useForm<TaskSchema>({
    initialState: {
      title: initialState.fields?.title ?? "",
      description: initialState.fields?.description ?? "",
      priority: initialState.fields?.priority ?? "medium",
    },
    isEditMode,
    state,
  });

  const [actionState, formAction, isPending] = useActionState(
    actions.taskAction,
    {
      success: false,
      message: "",
    },
  );

  useModalClose({ success: state.success }, "task", modalId);

  const resetValues: TaskSchema = {
    title: "",
    description: "",
    priority: "medium",
  };

  const handleTaskAction = (formData: FormData) => {
    handleAction(formData, schemas.taskSchema, formAction, resetValues);
  };

  useEffect(() => {
    setState({
      success: actionState.success ?? false,
      message: actionState.message ?? "",
    });
  }, [actionState.success, actionState.message]);

  return {
    handleAction: handleTaskAction,
    state: actionState,
    isPending,
    isFormInvalid,
    formRef,
    taskFormData,
    errors,
    clearError,
    handleFieldChange,
  };
}
