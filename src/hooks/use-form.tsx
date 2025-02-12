import { useRef, useState } from "react";
import type { ZodSchema } from "zod";
import getFormActions from "@/utils/get-form-actions";
import getFormSchema from "@/utils/get-form-schemas";
import isFormInvalid from "@/app/dashboard/utils/form-validation";
import validateAndProcessFormData from "@/app/dashboard/utils/validate-and-process-form";
import type { ActionStateResponse } from "@/lib/types";
import type { BoardSchema } from "@/utils/get-board-schemas";
import useClearError from "./use-clear-error";
import useAutoFocusOnError from "./use-auto-focus-on-error";
import { useServerError } from "./use-server-error";
import { debounce } from "@/utils/debounce";

type UseFormProps<T> = {
  initialState: T;
  isEditMode: boolean;
  state: ActionStateResponse;
  debounceDelay?: number;
};

const useForm = <T extends Record<string, string | null>>({
  initialState,
  isEditMode,
  state,
  debounceDelay = 300,
}: UseFormProps<T>) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<T>(initialState);
  const [requestId, setRequestId] = useState(0);

  const actions = getFormActions(isEditMode);
  const schemas = getFormSchema(isEditMode);

  const { errors, setErrors, clearError } = useClearError<T>();

  const isInvalid = isFormInvalid(errors);

  useServerError<T>(state, setErrors, requestId);
  useAutoFocusOnError<T>(errors, formRef);

  const debouncedSetFormData = debounce((field: keyof T, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, debounceDelay);

  const isDataChanged = Object.keys(initialState).some(
    (key) => formData[key] !== initialState[key],
  );

  const handleAction = (
    formData: FormData,
    schema: ZodSchema<BoardSchema>,
    formAction: (data: FormData) => void,
    resetValues: T,
  ) => {
    const isValid = validateAndProcessFormData<T>({
      formData,
      schema,
      isEditMode,
      isDataChanged,
      setErrors,
      setFormData,
    });

    if (!isValid) return;

    setRequestId((prev) => prev + 1);
    formAction(formData);
    setFormData(resetValues);
  };

  const handleFieldChange = (field: keyof T, value: string) => {
    clearError(field);
    debouncedSetFormData(field, value);
  };

  return {
    formRef,
    requestId,
    actions,
    schemas,
    errors,
    setErrors,
    clearError,
    isInvalid,
    formData,
    setFormData,
    handleFieldChange,
    isDataChanged,
    handleAction,
  };
};

export default useForm;
