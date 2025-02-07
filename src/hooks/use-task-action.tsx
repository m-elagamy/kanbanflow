import { useActionState, useEffect, useRef, useState } from "react";

import { createTaskAction, updateTaskAction } from "@/actions/task";
import validateFormData from "@/app/dashboard/utils/validate-form-data";
import checkFormErrors from "@/app/dashboard/utils/check-form-errors";
import type { TaskActionState } from "@/lib/types";
import processFormData from "@/app/dashboard/utils/process-form-data";
import handleValidationErrors from "@/app/dashboard/utils/handle-validation-errors";
import { taskSchema, type TaskSchema } from "@/schemas/task";

import useAutoFocusOnError from "./use-auto-focus-on-error";
import useClearError from "./use-clear-error";
import { useModalStore } from "@/stores/modal";

type UseTaskActionProps = {
  initialState: TaskActionState;
  isEditMode: boolean;
  modalId: string;
};

type TaskTitle = Pick<TaskSchema, "title">;

export default function useTaskAction({
  initialState,
  isEditMode,
  modalId,
}: UseTaskActionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [requestId, setRequestId] = useState(0);

  const { errors, setErrors, clearError } = useClearError<TaskTitle>();
  const closeModal = useModalStore((state) => state.closeModal);

  useAutoFocusOnError(errors, inputRef);

  const isFormInvalid = checkFormErrors(errors);

  const [state, formAction, isPending] = useActionState(
    isEditMode ? updateTaskAction : createTaskAction,
    {
      success: false,
      message: "",
    },
  );

  const [taskFormData, setTaskFormData] = useState<TaskSchema>({
    title: initialState.fields?.title ?? "",
    description: initialState.fields?.description ?? "",
    priority: initialState.fields?.priority ?? "medium",
  });

  const handleAction = (formData: FormData) => {
    const processedData = processFormData(formData);

    const schema = taskSchema.pick({ title: true });

    const validationResult = validateFormData(formData, schema);

    if (!validationResult.success) {
      handleValidationErrors(
        validationResult.error.flatten().fieldErrors,
        setErrors,
      );
      setTaskFormData(processedData as TaskSchema);
      return;
    }

    setRequestId((prev) => prev + 1);

    formAction(formData);

    setTaskFormData({
      title: "",
      description: "",
      priority: "medium",
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

  useEffect(() => {
    if (state.success) {
      closeModal("task", modalId);
    }
  }, [state.success, modalId, closeModal]);

  return {
    handleAction,
    state,
    isPending,
    isFormInvalid,
    inputRef,
    taskFormData,
    errors,
    clearError,
  };
}
