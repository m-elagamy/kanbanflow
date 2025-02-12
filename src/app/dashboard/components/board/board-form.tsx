"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import { Textarea } from "@/components/ui/textarea";
import FormActions from "@/components/ui/form-actions";
import ErrorMessage from "@/components/ui/error-message";
import useBoardAction from "@/hooks/use-board-action";
import type { BoardActionState, formOperationMode } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import columnsTemplates from "../../data/columns-templates";

type BoardFormProps = Readonly<{
  formOperationMode: formOperationMode;
  initialState: BoardActionState;
  modalId: string;
}>;

export default function BoardForm({
  formOperationMode,
  initialState,
  modalId,
}: BoardFormProps) {
  const isEditMode = formOperationMode === "edit";

  const {
    handleAction,
    state,
    isPending,
    boardFormData,
    errors,
    clearError,
    isFormInvalid,
    handleFieldChange,
    formRef,
  } = useBoardAction({ initialState, isEditMode, modalId });

  return (
    <form ref={formRef} action={handleAction} className="space-y-4 *:space-y-2">
      {errors.serverErrors.generic && (
        <ErrorMessage id="server-error" className="justify-center">
          {errors.serverErrors.generic}
        </ErrorMessage>
      )}

      <div>
        <Label
          htmlFor="title"
          className={`${errors.clientErrors.title || errors.serverErrors.specific ? "text-destructive" : ""}`}
        >
          Name <RequiredFieldSymbol />
        </Label>
        {isEditMode && (
          <Input
            type="hidden"
            name="boardId"
            value={initialState.boardId ?? ""}
          />
        )}
        <Input
          id="title"
          type="text"
          name="title"
          defaultValue={boardFormData.title || state.fields?.title}
          placeholder="e.g., Personal Tasks"
          onChange={(e) => handleFieldChange("title", e.target.value)}
          aria-invalid={
            !!errors.clientErrors.title || !!errors.serverErrors.specific
          }
          aria-describedby="title-error"
          aria-required
          autoFocus
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Choose a clear and descriptive name for your board.
        </p>
        {(errors.clientErrors.title || errors.serverErrors.specific) && (
          <ErrorMessage id="title-error">
            {errors.clientErrors.title || errors.serverErrors.specific}
          </ErrorMessage>
        )}
      </div>

      {!isEditMode && (
        <div>
          <Label
            htmlFor="template"
            className={`${errors.clientErrors.template ? "text-destructive" : ""}`}
          >
            Template <RequiredFieldSymbol />
          </Label>
          <Select name="template" onValueChange={() => clearError("template")}>
            <SelectTrigger
              aria-invalid={!!errors.clientErrors.template}
              id="template"
            >
              <SelectValue autoFocus placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {columnsTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" />
                      <h2>{template.title}</h2>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground">
            Start with a ready-made template or customize it later.
          </p>

          {errors.clientErrors.template && (
            <ErrorMessage id="template-error">
              {errors.clientErrors.template}
            </ErrorMessage>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="description"> Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={
            (boardFormData.description || state.fields?.description) ?? ""
          }
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Organize my daily and work tasks"
          className="resize-none"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Add a context to help you remember the board&apos;s purpose.
        </p>
      </div>

      <FormActions
        isFormInvalid={isFormInvalid}
        isPending={isPending}
        formOperationMode={formOperationMode}
      />
    </form>
  );
}
