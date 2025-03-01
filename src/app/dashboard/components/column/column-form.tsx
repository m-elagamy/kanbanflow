import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { createColumnAction } from "@/actions/column";
import { useColumnStore } from "@/stores/column";
import { useModalStore } from "@/stores/modal";
import delay from "@/utils/delay";
import generateUUID from "@/utils/generate-UUID";
import ErrorMessage from "@/components/ui/error-message";
import columnStatusSchema, { type ColumnStatus } from "@/schemas/column";
// import useAutoFocusOnError from "@/hooks/use-auto-focus-on-error";
import getAvailableStatusOptions from "@/utils/column-helpers";

import columnStatusOptions from "../../data/column-status-options";
import StatusOptionsSkeleton from "./status-options-skeleton";
import validateFormData from "../../utils/validate-form-data";

const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  {
    loading: () => null,
  },
);

const StatusOptions = dynamic(() => import("./status-options"), {
  loading: () => <StatusOptionsSkeleton />,
});

type ColumnFormProps = {
  boardId: string;
  modalId: string;
};

const tempId = generateUUID();

export default function ColumnForm({ boardId, modalId }: ColumnFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const columns = useColumnStore((state) => state.columns);
  const addColumnOptimistically = useColumnStore((state) => state.addColumn);
  const updateColumnId = useColumnStore((state) => state.updateColumnId);
  const isLoading = useColumnStore((state) => state.isLoading);
  const setIsLoading = useColumnStore((state) => state.setIsLoading);
  const revertToPrevious = useColumnStore((state) => state.revertToPrevious);
  const errorMessage = useColumnStore((state) => state.error);
  const setErrorMessage = useColumnStore((state) => state.setError);
  const closeModal = useModalStore((state) => state.closeModal);

  const availableStatusOptions = getAvailableStatusOptions(
    Object.values(columns),
    columnStatusOptions,
  );
  const hasAvailableStatuses = availableStatusOptions.length > 0;

  const triggerTitle = hasAvailableStatuses
    ? "Choose a status"
    : "All statuses are in use or unavailable.";

  const placeholder = hasAvailableStatuses
    ? "e.g. To Do, In Progress, or Done"
    : "No available statuses";

  const handleFormAction = async (formData: FormData) => {
    const validationResult = validateFormData<{
      status: ColumnStatus;
    }>(formData, columnStatusSchema);

    if (!validationResult.success) {
      setErrorMessage("Please pick a status.");
      return;
    }

    setIsLoading(true);
    await delay(300);

    addColumnOptimistically({
      id: tempId,
      status: validationResult.data.status,
      boardId,
    });

    closeModal("column", modalId);
    setIsLoading(false);

    try {
      const createdColumn = await createColumnAction(
        boardId,
        validationResult.data.status,
      );
      updateColumnId(tempId, createdColumn.fields?.id);
    } catch (error) {
      console.error("Error creating column:", error);
      revertToPrevious();
      toast.error("Failed to create column", {
        description:
          "An error occurred while creating the column. Please try again.",
        icon: "🚨",
        duration: 5000,
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setIsContentLoaded(true);
  };
  const handleValueChange = () => setErrorMessage(null);

  useEffect(() => {
    return () => {
      setErrorMessage(null);
    };
  }, [setErrorMessage]);

  return (
    <form ref={formRef} action={handleFormAction} className="space-y-4">
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={boardId ?? ""} />
        <Label
          htmlFor="status"
          className={`${errorMessage ? "text-destructive" : ""}`}
        >
          Status
        </Label>
        <Select
          name="status"
          onValueChange={handleValueChange}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            id="status"
            title={triggerTitle}
            disabled={!hasAvailableStatuses}
            aria-disabled={!hasAvailableStatuses}
            aria-describedby={errorMessage ? "column-error" : undefined}
            aria-invalid={!!errorMessage}
            className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          {errorMessage && (
            <ErrorMessage id="column-error">{errorMessage}</ErrorMessage>
          )}
          {isContentLoaded && hasAvailableStatuses && (
            <SelectContent className="max-h-80">
              {availableStatusOptions.map(([status, { icon: Icon, color }]) => (
                <StatusOptions
                  key={status}
                  status={status}
                  Icon={Icon}
                  color={color}
                />
              ))}
            </SelectContent>
          )}
        </Select>
      </section>

      <SubmitButton
        isPending={isLoading}
        isFormInvalid={!hasAvailableStatuses || !!errorMessage}
        formMode="create"
      />
    </form>
  );
}
