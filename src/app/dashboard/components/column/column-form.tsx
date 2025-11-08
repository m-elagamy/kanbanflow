import { RefObject, useState } from "react";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createColumnAction } from "@/actions/column";
import { useColumnStore } from "@/stores/column";
import { useModalStore } from "@/stores/modal";
import delay from "@/utils/delay";
import generateUUID from "@/utils/generate-UUID";
import columnStatusSchema, { type ColumnStatus } from "@/schemas/column";
import getAvailableStatusOptions from "@/utils/column-helpers";
import GenericForm from "@/components/ui/generic-form";
import useAutoFocusOnError from "@/hooks/use-auto-focus-on-error";
import useErrorManagement from "@/hooks/use-error-management";
import columnStatusOptions from "../../data/column-status-options";
import StatusOptionsSkeleton from "./status-options-skeleton";
import validateFormData from "../../utils/validate-form-data";
import useLoadingStore from "@/stores/loading";
import handleOnError from "@/utils/handle-on-error";
import FormMessage from "@/components/ui/form-message";

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

  const { columns, addColumn, updateColumnId, rollback } = useColumnStore(
    useShallow((state) => ({
      columns: state.columnsByBoard[boardId],
      addColumn: state.addColumn,
      updateColumnId: state.updateColumnId,
      rollback: state.rollback,
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
    await delay(400);

    addColumn(boardId, {
      id: tempId,
      status: validationResult.data.status,
      order: 0,
    });

    closeModal("column", modalId);
    setIsLoading("column", "creating", false, tempId);

    try {
      const createdColumn = await createColumnAction(
        boardId,
        validationResult.data.status,
      );

      if (!createdColumn.fields) return;

      updateColumnId(boardId, tempId, createdColumn.fields?.id);
    } catch (error) {
      console.error("Error creating column:", error);
      handleOnError(error, "Failed to create column");
      rollback();
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
      formRef={formRef as RefObject<HTMLFormElement>}
      onAction={handleFormAction}
      isLoading={isLoading}
      errors={errors}
      hasAvailableStatuses={hasAvailableStatuses}
    >
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={boardId ?? ""} />
        <Label htmlFor="status">Status</Label>
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
            className="w-full"
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
        {errors?.status && (
          <FormMessage id="column-error" variant="error" animated>
            {errors?.status}
          </FormMessage>
        )}
        <FormMessage error={!!errors?.status} variant="helper">
          Only active statuses allow tasks to be assigned.
        </FormMessage>
      </section>
    </GenericForm>
  );
}
