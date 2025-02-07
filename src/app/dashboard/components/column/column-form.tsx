"use client";

import { useActionState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import stateOptions from "../../data/column-state-options";
import { Label } from "@/components/ui/label";
import { createColumnAction } from "@/actions/column";
import { Input } from "@/components/ui/input";
import FormActions from "@/components/ui/form-actions";
import { useModalStore } from "@/stores/modal";

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
  const [serverState, formAction, isPending] = useActionState(
    createColumnAction,
    { success: false, message: "" },
  );

  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    if (serverState.success) {
      closeModal("column", modalId);
    }
  }, [serverState.success, closeModal, modalId]);

  return (
    <form action={formAction} className="space-y-4">
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={boardId ?? ""} />
        <Input type="hidden" name="boardSlug" value={boardSlug ?? ""} />
        <Label>Select Column Status</Label>
        <Select name="status" defaultValue="To Do">
          <SelectTrigger>
            <SelectValue placeholder="Choose a status" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {Object.entries(stateOptions).map(
              ([status, { icon: Icon, color }]) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center space-x-2">
                    <Icon size={16} color={color} />
                    <span>{status}</span>
                  </div>
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </section>
      <FormActions isPending={isPending} formOperationMode="create" />
    </form>
  );
}
