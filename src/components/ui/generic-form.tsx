import type { RefObject } from "react";
import dynamic from "next/dynamic";
import Form from "next/form";
import { AnimatePresence } from "framer-motion";
import { FileX } from "lucide-react";
import type { FormErrors, FormMode } from "@/lib/types";
import hasErrors from "@/app/dashboard/utils/check-form-errors";
import FormActions from "./form-actions";

const FormMessage = dynamic(() => import("./form-message"), {
  loading: () => null,
  ssr: false,
});

interface GenericFormProps {
  children: React.ReactNode;
  formRef: RefObject<HTMLFormElement>;
  onAction: (formData: FormData) => Promise<void>;
  errors?: FormErrors<unknown> | null;
  formMode?: FormMode;
  isLoading?: boolean;
  hasAvailableStatuses?: boolean;
}

const GenericForm = ({
  children,
  formRef,
  onAction,
  errors,
  formMode,
  isLoading,
  hasAvailableStatuses,
}: GenericFormProps) => {
  return (
    <Form
      ref={formRef}
      action={onAction}
      aria-invalid={!!errors?.generic}
      aria-describedby="generic-error"
      disabled={isLoading}
      className="space-y-4 *:space-y-2"
    >
      <AnimatePresence>
        {errors?.generic && (
          <FormMessage
            id="generic-error"
            icon={FileX}
            variant="info"
            className="mx-auto w-fit justify-center border px-2 py-1 shadow-sm"
            animated
          >
            {errors?.generic}
          </FormMessage>
        )}
      </AnimatePresence>

      {children}

      <FormActions
        isPending={isLoading}
        isFormInvalid={hasErrors(errors) ?? !hasAvailableStatuses}
        formMode={formMode}
      />
    </Form>
  );
};

export default GenericForm;
