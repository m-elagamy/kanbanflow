import { useActionState, useState } from "react";
import dynamic from "next/dynamic";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createColumnAction } from "@/actions/column";
import { Input } from "@/components/ui/input";
import FormActions from "@/components/ui/form-actions";
import useModalClose from "@/hooks/use-modal-close";
import { useKanbanStore } from "@/stores/kanban";
import columnStatusOptions from "../../data/column-status-options";
import StatusOptions from "./status-options";

const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  {
    loading: () => null,
  },
);

type ColumnFormProps = {
  boardId: string;
  modalId: string;
  boardSlug: string;
};

export default function ColumnForm({
  boardId,
  modalId,
  boardSlug,
}: ColumnFormProps) {
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const columns = useKanbanStore((state) => state.columns);

  const [serverState, formAction, isPending] = useActionState(
    createColumnAction,
    { success: false, message: "" },
  );

  useModalClose({ success: serverState.success }, "column", modalId);

  const existingStatuses = columns?.map((column) => column.status) ?? [];

  const availableStatusOptions = Object.entries(columnStatusOptions).filter(
    ([status]) => !existingStatuses.includes(status),
  );

  const handleTriggerClick = () => setIsContentLoaded(true);

  const isThereAvailableStatuses = availableStatusOptions.length > 0;

  const triggerTitle = !isThereAvailableStatuses
    ? "All statuses are in use or unavailable."
    : "Choose a status";

  const placeholder = !isThereAvailableStatuses
    ? "No available statuses"
    : "Select from Options";

  return (
    <form action={formAction} className="space-y-4">
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={boardId ?? ""} />
        <Input type="hidden" name="boardSlug" value={boardSlug ?? ""} />
        <Label htmlFor="status">Choose a Column Status</Label>
        <Select name="status" required>
          <SelectTrigger
            id="status"
            title={triggerTitle}
            disabled={!isThereAvailableStatuses}
            aria-disabled={!isThereAvailableStatuses}
            onClick={handleTriggerClick}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          {isContentLoaded && isThereAvailableStatuses && (
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
      <FormActions
        isPending={isPending}
        isFormInvalid={!isThereAvailableStatuses}
        formOperationMode="create"
      />
    </form>
  );
}
