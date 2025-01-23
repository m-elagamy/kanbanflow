"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import columnsTemplates from "../../data/columns-templates";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import { Textarea } from "@/components/ui/textarea";
import { useBoardAction } from "@/hooks/use-board-action";
import ErrorMessage from "@/components/ui/error-message";
import type {
  CreateBoardActionState,
  EditBoardActionState,
  Mode,
} from "@/lib/types";

export default function BoardForm({
  mode,
  initialState,
}: {
  mode: Mode;
  initialState: CreateBoardActionState | EditBoardActionState;
}) {
  const {
    state,
    formAction,
    isPending,
    titleRef,
    clearError,
    validationErrors,
    errorMessage,
  } = useBoardAction({ mode: mode, initialState });

  return (
    <form action={formAction} className="space-y-4 *:space-y-2">
      <div>
        <Label
          htmlFor="title"
          className={`${validationErrors?.title || (errorMessage && !validationErrors && !state.success) ? "text-destructive" : ""}`}
        >
          Board Name <RequiredFieldSymbol />
        </Label>
        {mode == "edit" && (
          <Input
            type="hidden"
            name="boardId"
            value={state.fields?.boardId ?? ""}
          />
        )}
        <Input
          ref={titleRef}
          id="title"
          type="text"
          name="title"
          placeholder="e.g., Personal Tasks"
          defaultValue={state.fields?.title ?? ""}
          onChange={() => clearError("title")}
          aria-invalid={
            !!validationErrors?.title || !!(errorMessage && !validationErrors)
          }
          aria-describedby="title-error"
          aria-required
          autoFocus
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Choose a clear and descriptive name for your board.
        </p>
        {/* Show error message if the title field is invalid or there's a generic error. */}
        {validationErrors?.title ||
        (errorMessage && !validationErrors && !state.success) ? (
          <ErrorMessage id="title-error">
            {validationErrors?.title?._errors?.at(0) ?? errorMessage}
          </ErrorMessage>
        ) : null}
      </div>

      {mode === "create" && (
        <div>
          <Label
            htmlFor="template"
            className={`${validationErrors?.template ? "text-destructive" : ""}`}
          >
            Board Template <RequiredFieldSymbol />
          </Label>
          <Select
            name="template"
            onValueChange={() => clearError("template")}
            aria-invalid={!!validationErrors?.template}
            aria-describedby="template-error"
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
          {validationErrors?.template && (
            <ErrorMessage id="template-error">
              {validationErrors?.template._errors?.at(0)}
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
          defaultValue={state.fields?.description ?? ""}
          className="resize-none"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Add a context to help you remember the board&apos;s purpose.
        </p>
      </div>

      <DialogFooter>
        <Button className="px-2" disabled={isPending}>
          {isPending && <Loader className="animate-spin" aria-hidden />}
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogFooter>
      <p aria-live="polite" className="sr-only" role="status">
        {state.message}
      </p>
    </form>
  );
}
