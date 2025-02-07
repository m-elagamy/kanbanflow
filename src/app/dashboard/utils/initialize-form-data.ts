export default function initializeFormData<T extends Record<string, unknown>>(
  initialState: { fields?: Partial<T> },
  fields: (keyof T)[],
): T {
  return fields.reduce((acc, field) => {
    acc[field] = (initialState.fields?.[field] ?? null) as T[typeof field];
    return acc;
  }, {} as T);
}
