import type { ServerErrors } from "@/lib/types";

const checkFormErrors = (errors: {
  clientErrors: Record<string, string>;
  serverErrors: ServerErrors;
}) => {
  return (
    Object.values(errors.clientErrors).some(Boolean) ||
    Object.values(errors.serverErrors).some(Boolean)
  );
};

export default checkFormErrors;
