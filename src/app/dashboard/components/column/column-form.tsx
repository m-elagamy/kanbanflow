import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createColumnAction } from "@/actions/column";
import { useColumnStore } from "@/stores/column";
import { useModalStore } from "@/stores/modal";
import delay from "@/utils/delay";
import generateUUID from "@/utils/generate-UUID";
import ErrorMessage from "@/components/ui/error-message";
import columnStatusSchema, { type ColumnStatus } from "@/schemas/column";
import getAvailableStatusOptions from "@/utils/column-helpers";
import HelperText from "@/components/ui/helper-text";
import GenericForm from "@/components/ui/generic-form";
import useAutoFocusOnError from "@/hooks/use-auto-focus-on-error";
import useErrorManagement from "@/hooks/use-error-management";
import columnStatusOptions from "../../data/column-status-options";
import StatusOptionsSkeleton from "./status-options-skeleton";
import validateFormData from "../../utils/validate-form-data";
import useLoadingStore from "@/stores/loading";
import { useShallow } from "zustand/react/shallow";

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
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const closeModal = useModalStore((state) => state.closeModal);

  const { columns, addColumnOptimistically, updateColumnId, revertToPrevious } =
    useColumnStore(
      useShallow((state) => ({
        columns: state.columns,
        addColumnOptimistically: state.addColumn,
        updateColumnId: state.updateColumnId,
        revertToPrevious: state.revertToPrevious,
      })),
    );

  const { isLoading, setIsLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading("column", "creating"),
      setIsLoading: state.setIsLoading,
    })),
  );

  const availableStatusOptions = getAvailableStatusOptions(
    Object.values(columns),
    columnStatusOptions,
  );
  const hasAvailableStatuses = availableStatusOptions.length > 0;

  const triggerTitle = hasAvailableStatuses
    ? "Choose a status"
    : "All statuses are in use or unavailable.";

  const placeholder = hasAvailableStatuses
    ? "e.g., To Do, In Progress"
    : "No available statuses";

  const handleFormAction = async (formData: FormData) => {
    const validationResult = validateFormData<{
      status: ColumnStatus;
    }>(formData, columnStatusSchema);

    if (!validationResult.success) {
      setSpecificError("status", "Please select a status for this column.");
      return;
    }

    setIsLoading("column", "creating", true, tempId);
    await delay(300);

    addColumnOptimistically({
      id: tempId,
      status: validationResult.data.status,
      boardId,
    });

    closeModal("column", modalId);
    setIsLoading("column", "creating", false, tempId);

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
  const handleValueChange = () => clearFieldError("status");

  const { errors, setSpecificError, clearFieldError } = useErrorManagement<{
    status: string;
  }>();

  const formRef = useAutoFocusOnError(errors, {
    delay: 300,
  });

  return (
    <GenericForm
      formRef={formRef}
      onAction={handleFormAction}
      isLoading={isLoading}
      errors={errors}
      hasAvailableStatuses={hasAvailableStatuses}
    >
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={boardId ?? ""} />
        <Label
          htmlFor="status"
          className={`${errors?.status ? "text-destructive" : ""} transition-colors`}
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
            aria-describedby={errors?.status ? "column-error" : undefined}
            aria-invalid={!!errors?.status}
            className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
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
        <HelperText error={!!errors?.status}>
          Only active statuses allow tasks to be assigned.
        </HelperText>
        {errors?.status && (
          <ErrorMessage id="column-error">{errors?.status}</ErrorMessage>
        )}
      </section>
    </GenericForm>
  );
}
