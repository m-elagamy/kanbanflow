// type FormErrors<T> = {
//   clientErrors: Partial<Record<keyof T, string>>
//   serverErrors: string[]
// }

import type { FormErrors } from "@/lib/types";

const isFormInvalid = <T>(errors: FormErrors<T>): boolean => {
  return (
    Object.values(errors.clientErrors).some(Boolean) ||
    Object.values(errors.serverErrors).some(Boolean)
  );
};

export default isFormInvalid;
