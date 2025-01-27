import { useActionState, useEffect, useRef, useState } from "react";
import { debounce } from "@/utils/debounce";
import type { ZodError, ZodSchema } from "zod";
import type { ActionMode } from "@/lib/types";

import { BoardActionState } from "@/utils/get-board-action";
import { TaskActionState } from "@/utils/get-task-action";
import { useModalStore } from "@/stores/modal";
import { useRouter } from "next/navigation";

type UseAction<T extends BoardActionState | TaskActionState> = {
  initialState: T;
  actionMode: ActionMode;
  getAction: (mode: ActionMode) => (state: T, formData: FormData) => Promise<T>;
  schema: ZodSchema;
  fields: string[];
  modalType: "board" | "task" | "column";
  modalId: string;
};

export function useAction<T extends BoardActionState | TaskActionState>({
  initialState,
  actionMode,
  getAction,
  schema,
  fields,
  modalType,
  modalId,
}: UseAction<T>) {
  const router = useRouter();

  const [serverState, formAction, isPending] = useActionState(
    getAction(actionMode),
    initialState as Awaited<T>,
  );

  const closeModal = useModalStore((state) => state.closeModal);

  const [formValues, setFormValues] = useState<
    Record<string, FormDataEntryValue>
  >(Object.fromEntries(fields.map((field) => [field, ""])));

  const [fieldErrors, setFieldErrors] = useState<T["errors"]>(undefined);
  const [serverError, setServerError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  const clearFieldValidationError = debounce((field: string) => {
    setFieldErrors((prevErrors) => {
      if (prevErrors) {
        return { ...prevErrors, [field]: "" };
      }
      return prevErrors;
    });
    setServerError(null);
    setFormValues((prevValues) => ({ ...prevValues, [field]: "" }));
  }, 300);

  const handleServerAction = async (formData: FormData) => {
    const validationResult = validateForm(formData);

    if (!validationResult.success) {
      handleValidationErrors(validationResult.error, formData);
      return;
    }

    formAction(formData);
  };

  const validateForm = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    return schema.safeParse(data);
  };

  const handleValidationErrors = (error: ZodError, formData: FormData) => {
    setFieldErrors(error.format());
    setFormValues(Object.fromEntries(formData.entries()));
  };

  useEffect(() => {
    if (fieldErrors?.title || serverError) {
      titleRef.current?.focus();
    }
  }, [fieldErrors, serverError]);

  useEffect(() => {
    if (!serverState.success && serverState.message) {
      setServerError(serverState.message);
    }
  }, [serverState.success, serverState]);

  useEffect(() => {
    if (serverState.success) {
      closeModal(modalType, modalId);
      router.refresh();
    }
  }, [closeModal, modalType, serverState.success, modalId, router]);

  useEffect(() => {
    if (serverState.boardSlug && serverState.isUpdating) {
      router.replace(serverState.boardSlug);
    } else if (serverState.boardSlug) {
      router.push(serverState.boardSlug);
    }
    router.refresh();
  }, [serverState.boardSlug, serverState.isUpdating, router]);

  return {
    serverState,
    serverError,
    isPending,
    titleRef,
    clearFieldValidationError,
    fieldErrors,
    handleServerAction,
    formValues,
  };
}
