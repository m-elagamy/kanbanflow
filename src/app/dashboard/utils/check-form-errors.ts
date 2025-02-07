const checkFormErrors = (errors: {
  clientErrors: Record<string, string>;
  serverError: string;
}) => {
  return (
    Object.values(errors.clientErrors).some(Boolean) || !!errors.serverError
  );
};

export default checkFormErrors;
