const processFormData = <T extends Record<string, unknown>>(
  formData: FormData,
): T => {
  const entries = Object.fromEntries(formData);
  return entries as T;
};

export default processFormData;
