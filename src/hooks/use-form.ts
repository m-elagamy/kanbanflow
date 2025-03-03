import type { FormErrors } from "@/lib/types";
import useAutoFocusOnError from "./use-auto-focus-on-error";
import useErrorManagement from "./use-error-management";
import useFormValues from "./use-form-values";
import validateFormData from "@/app/dashboard/utils/validate-form-data";
import { ZodSchema } from "zod";
import hasChanges from "@/app/dashboard/utils/check-for-changes";
import hasDuplicateTitle from "@/app/dashboard/utils/check-for-duplicates";

const useForm = <T extends Record<string, unknown>>(
  initialState: T,
  schema: ZodSchema,
) => {
  const {
    errors,
    setSpecificError,
    setGenericError,
    clearFieldError,
    clearGenericError,
  } = useErrorManagement<T>();

  const formRef = useAutoFocusOnError<T>(errors, {
    delay: 300,
  });

  const { formValues, handleOnChange } = useFormValues<T>({
    initialState,
    onFieldChange: (field) => {
      if (shouldClearErrors(errors, field)) {
        clearFieldError(field);
        clearGenericError();
      }
    },
  });

  const shouldClearErrors = (
    errors: FormErrors<T> | null,
    field: keyof T,
  ): boolean => {
    return !!errors?.[field] || !!errors?.generic;
  };

  const validateBeforeSubmit = (
    formData: FormData,
    isEditMode: boolean,
    existingItems: { id: string; title: string }[],
    subsetFields: (keyof T)[],
    entityType: "board" | "task" = "board",
  ) => {
    const {
      success,
      data: validatedData,
      error,
    } = validateFormData(formData, schema);
    if (!success) {
      setSpecificError("title", error.issues[0]?.message);
      return { success: false };
    }

    // Check for duplicates (only if `existingItems` is provided)
    if (
      existingItems &&
      hasDuplicateTitle(
        validatedData.title as string,
        existingItems,
        initialState.id as string,
      )
    ) {
      setSpecificError(
        "title",
        `A ${entityType} with the name "${validatedData.title}" already exists.`,
      );
      return {
        success: false,
      };
    }

    // Check if changes were actually made
    if (isEditMode && !hasChanges(initialState, validatedData, subsetFields)) {
      setGenericError(
        "No changes detected. Please update something before submitting.",
      );

      return { success: false };
    }

    return { success: true, data: validatedData };
  };

  return {
    formValues,
    handleOnChange,
    errors,
    setSpecificError,
    setGenericError,
    formRef,
    validateBeforeSubmit,
  };
};

export default useForm;
