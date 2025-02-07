const handleValidationErrors = <T extends Record<string, string[] | undefined>>(
  validationErrors: T,
  onError: (errors: {
    clientErrors: Record<string, string>;
    serverError: string;
  }) => void,
) => {
  const clientErrors = Object.keys(validationErrors).reduce(
    (acc, field) => ({
      ...acc,
      [field]: validationErrors[field]?.at(0) ?? "",
    }),
    {} as Record<string, string>,
  );

  onError({
    clientErrors,
    serverError: "",
  });
};

export default handleValidationErrors;
