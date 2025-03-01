export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      result[key] = obj[key];
    }
  }
  return result as Omit<T, K>;
};
