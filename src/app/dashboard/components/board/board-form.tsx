"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import columnsTemplates from "../../data/columns-templates";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import { Textarea } from "@/components/ui/textarea";
import { useBoardAction } from "@/hooks/use-board-action";
import ErrorMessage from "@/components/ui/error-message";
import type {
  CreateBoardActionState,
  EditBoardActionState,
  ActionMode,
} from "@/lib/types";
import FormActions from "@/components/ui/form-actions";

export default function BoardForm({
  mode,
  initialState,
  modalId,
}: {
  mode: ActionMode;
  initialState: CreateBoardActionState | EditBoardActionState;
  modalId: string;
}) {
  const {
    serverState,
    serverError,
    isPending,
    titleRef,
    clearFieldValidationError,
    fieldErrors,
    handleServerAction,
    formValues,
  } = useBoardAction({ actionMode: mode, initialState, modalId });

  return (
    <form action={handleServerAction} className="space-y-4 *:space-y-2">
      <div>
        <Label
          htmlFor="title"
          className={`${fieldErrors?.title || serverError ? "text-destructive" : ""}`}
        >
          Board Name <RequiredFieldSymbol />
        </Label>
        {mode == "edit" && (
          <Input
            type="hidden"
            name="boardId"
            value={serverState.fields?.boardId ?? ""}
          />
        )}
        <Input
          ref={titleRef}
          id="title"
          type="text"
          name="title"
          placeholder="e.g., Personal Tasks"
          defaultValue={
            (formValues.title as string) || serverState.fields?.title
          }
          onChange={() => clearFieldValidationError("title")}
          aria-required
          autoFocus
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Choose a clear and descriptive name for your board.
        </p>
        {fieldErrors?.title || serverError ? (
          <ErrorMessage id="title-error">
            {fieldErrors?.title?._errors?.at(0) ?? serverError}
          </ErrorMessage>
        ) : null}
      </div>

      {mode === "create" && (
        <div>
          <Label
            htmlFor="template"
            className={`${
              fieldErrors && "template" in fieldErrors && fieldErrors.template
                ? "text-destructive"
                : ""
            }`}
          >
            Board Template <RequiredFieldSymbol />
          </Label>
          <Select
            name="template"
            onValueChange={() => clearFieldValidationError("template")}
          >
            <SelectTrigger id="template">
              <SelectValue placeholder="Select a template" />
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

          {fieldErrors &&
            "template" in fieldErrors &&
            fieldErrors.template?._errors?.at(0) && (
              <ErrorMessage id="template-error">
                {fieldErrors.template._errors.at(0)}
              </ErrorMessage>
            )}
        </div>
      )}

      <div>
        <Label htmlFor="description">Board Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Organize my daily and work tasks"
          defaultValue={
            ((formValues.description as string) ||
              serverState.fields?.description) ??
            ""
          }
          className="resize-none"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Add a context to help you remember the board&apos;s purpose.
        </p>
      </div>

      {<FormActions isPending={isPending} mode={mode} />}
    </form>
  );
}
