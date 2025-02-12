"use client";

import { useActionState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createColumnAction } from "@/actions/column";
import { Input } from "@/components/ui/input";
import FormActions from "@/components/ui/form-actions";
import useModalClose from "@/hooks/use-modal-close";
import columnStatusOptions from "../../data/column-status-options";
import { useKanbanStore } from "@/stores/kanban";
import { useShallow } from "zustand/react/shallow";

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

  const isThereAvailableStatuses = availableStatusOptions.length > 0;

  const triggerTitle = !isThereAvailableStatuses
    ? "All statuses are in use or unavailable."
    : "Choose a status";

  const placeholder = !isThereAvailableStatuses
    ? "No available statuses"
    : "Choose a status";

  return (
    <form action={formAction} className="space-y-4">
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={boardId ?? ""} />
        <Input type="hidden" name="boardSlug" value={boardSlug ?? ""} />
        <Label>Select Column Status</Label>
        <Select name="status" defaultValue={availableStatusOptions[0]?.[0]}>
          <SelectTrigger
            disabled={!isThereAvailableStatuses}
            title={triggerTitle}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {availableStatusOptions.map(([status, { icon: Icon, color }]) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center space-x-2">
                  <Icon size={16} color={color} />
                  <span>{status}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
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
