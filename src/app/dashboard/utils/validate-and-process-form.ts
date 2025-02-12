import validateFormData from "@/app/dashboard/utils/validate-form-data";
import processFormData from "@/app/dashboard/utils/process-form-data";
import handleValidationErrors from "@/app/dashboard/utils/handle-validation-errors";
import type { ZodSchema } from "zod";
import type { FormErrors } from "@/lib/types";

type ValidationOptions<T> = {
  formData: FormData;
  schema: ZodSchema;
  isEditMode?: boolean;
  isDataChanged?: boolean;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors<T>>>;
  setFormData: (data: T) => void;
};

export default function validateAndProcessFormData<T>({
  formData,
  schema,
  setErrors,
  setFormData,
  isEditMode = false,
  isDataChanged = true,
}: ValidationOptions<T>): boolean {
  const processedData = processFormData(formData);

  const validationResult = validateFormData(formData, schema);

  if (!validationResult.success) {
    handleValidationErrors(
      validationResult.error.flatten().fieldErrors,
      setErrors,
    );
    setFormData(processedData as T);
    return false;
  }

  if (isEditMode && !isDataChanged) {
    setErrors({
      clientErrors: {},
      serverErrors: {
        generic:
          "No changes detected. Please modify something before submitting.",
        specific: "",
      },
    } as FormErrors<T>);
    return false;
  }

  return true;
}
