import { ZodSchema } from "zod";
import validateFormData from "@/app/dashboard/utils/validate-form-data";
import hasChanges from "@/app/dashboard/utils/check-for-changes";
import hasDuplicateTitle from "@/app/dashboard/utils/check-for-duplicates";
import useAutoFocusOnError from "./use-auto-focus-on-error";
import useErrorManagement from "./use-error-management";
import useFormValues from "./use-form-values";

const useForm = <
  T extends Record<string, unknown>,
  V extends Record<string, unknown> = T,
>(
  initialState: T,
  schema: ZodSchema<V>,
) => {
  const {
    errors,
    setSpecificError,
    setGenericError,
    clearFieldError,
    clearGenericError,
  } = useErrorManagement<T>();

  const { formValues, handleOnChange } = useFormValues<T>({
    initialState,
    onFieldChange: (field) => {
      if (errors?.[field]) clearFieldError(field);
      if (errors?.generic) clearGenericError();
    },
  });

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
    } = validateFormData<V>(formData, schema);
    if (!success) {
      console.error("Validation error:", error);

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
    if (
      isEditMode &&
      !hasChanges(initialState, validatedData as Partial<T>, subsetFields)
    ) {
      setGenericError(
        "No changes detected. Please update something before submitting.",
      );

      return { success: false };
    }

    return { success: true, data: validatedData };
  };

  const formRef = useAutoFocusOnError<T>(errors, {
    delay: 300,
  });

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
