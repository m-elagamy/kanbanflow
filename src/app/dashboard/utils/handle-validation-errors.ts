import type { FormErrors } from "@/lib/types";

const handleValidationErrors = <T extends Record<string, string[] | undefined>>(
  validationErrors: T,
  onError: (errors: FormErrors<T>) => void,
) => {
  const clientErrors = Object.keys(validationErrors).reduce(
    (acc, field) => ({
      ...acc,
      [field]: validationErrors[field]?.at(0) ?? "",
    }),
    {} as Partial<Record<keyof T, string>>,
  );

  onError({
    clientErrors,
    serverErrors: { specific: "", generic: "" },
  });
};

export default handleValidationErrors;
