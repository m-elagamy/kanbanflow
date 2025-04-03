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

type GenericFormProps = {
  children: React.ReactNode;
  formRef: {
    current: HTMLFormElement | null;
  };
  onAction: (formData: FormData) => Promise<void>;
  errors?: FormErrors<unknown> | null;
  formMode?: FormMode;
  isLoading?: boolean;
  hasAvailableStatuses?: boolean;
};

const GenericForm = ({ children, ...props }: GenericFormProps) => {
  return (
    <Form
      ref={props.formRef}
      action={props.onAction}
      aria-invalid={!!props.errors?.generic}
      aria-describedby="generic-error"
      disabled={props.isLoading}
      className="space-y-4 *:space-y-2"
    >
      <AnimatePresence>
        {props.errors?.generic && (
          <FormMessage
            id="generic-error"
            icon={FileX}
            variant="info"
            className="mx-auto w-fit justify-center border px-2 py-1"
            animated
          >
            {props.errors?.generic}
          </FormMessage>
        )}
      </AnimatePresence>

      {children}

      <FormActions
        isPending={props.isLoading}
        isFormInvalid={hasErrors(props.errors) ?? !props.hasAvailableStatuses}
        formMode={props.formMode}
      />
    </Form>
  );
};

export default GenericForm;
