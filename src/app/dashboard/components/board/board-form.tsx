"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Board } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import { Textarea } from "@/components/ui/textarea";
import type { FormMode, Templates } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  constructColumns,
  createOptimisticBoard,
  handleOnBlur,
} from "@/utils/board-helpers";
import { slugify } from "@/utils/slugify";
import { createBoardAction, updateBoardAction } from "@/actions/board";
import { boardSchema, type BoardFormSchema } from "@/schemas/board";
import ErrorMessage from "@/components/ui/error-message";
import { omit } from "@/utils/object";
import { useBoardFormStore } from "@/hooks/use-board-form-store";
import useForm from "@/hooks/use-form";
import handleOnError from "@/utils/handle-on-error";
import GenericForm from "@/components/ui/generic-form";
import columnsTemplates from "../../data/columns-templates";
import { useUpdatePredefinedColumnsId } from "@/hooks/use-update-predefined-columns-id";

type BoardFormProps = Readonly<{
  formMode: FormMode;
  board?: Pick<Board, "id" | "title" | "description" | "slug">;
  modalId: string;
}>;

type BoardFormValues = BoardFormSchema & { id: string };

export default function BoardForm({
  formMode,
  board,
  modalId,
}: BoardFormProps) {
  const isEditMode = formMode === "edit";

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    boards,
    createBoard,
    updateBoard,
    updateBoardId,
    deleteBoard,
    activeBoardId,
    setColumns,
    closeModal,
  } = useBoardFormStore();

  const updateColumnIds = useUpdatePredefinedColumnsId();

  const {
    formValues: boardFormData,
    handleOnChange,
    formRef,
    errors,
    validateBeforeSubmit,
  } = useForm<BoardFormValues>(
    {
      id: board?.id ?? "",
      title: board?.title ?? "",
      description: board?.description ?? "",
      template: "personal",
    },
    boardSchema,
  );

  const existingBoards = Object.values(boards).map(({ id, title }) => ({
    id,
    title,
  }));

  const handleFormAction = async (formData: FormData) => {
    const { success, data: validatedData } = validateBeforeSubmit(
      formData,
      isEditMode,
      existingBoards,
      ["title", "description"],
    );

    if (!success || !validatedData) return;

    const { title, description } = validatedData;

    const slug = slugify(title);

    const optimisticBoard = createOptimisticBoard(title, description ?? "");

    if (isEditMode && board) {
      updateBoard(board?.id, omit(optimisticBoard, ["id"]));
      closeModal("board", modalId);

      try {
        const response = await updateBoardAction(formData);
        const isSlugChanged = response.fields?.slug !== board?.slug;
        const isActiveBoard = activeBoardId === board.id;

        if (isSlugChanged && isActiveBoard) {
          router.replace(`/dashboard/${response.fields?.slug}`);
        }
      } catch (error) {
        handleOnError(error, "Failed to update board.");
        updateBoard(board.id, board);
      }

      return;
    }

    startTransition(async () => {
      createBoard(optimisticBoard);

      Promise.resolve().then(() => router.push(`/dashboard/${slug}`));

      createBoardAction(formData).then(
        (res) => {
          if (!res.fields) return;

          updateBoardId(optimisticBoard.id, res.fields.id);

          updateColumnIds(res.fields.id, res.fields.columns);
        },
        (err) => {
          handleOnError(err, "Failed to create board.");
          router.replace("/dashboard");
          closeModal("board", modalId);
          deleteBoard(optimisticBoard.id);
        },
      );
    });
  };

  useEffect(() => {
    if (isEditMode) return;
    setColumns(constructColumns("personal"));
  }, [isEditMode, setColumns]);

  return (
    <GenericForm
      formRef={formRef}
      onAction={handleFormAction}
      formMode={formMode}
      errors={errors}
      isLoading={isPending}
    >
      <div>
        {isEditMode && <Input type="hidden" name="boardId" value={board?.id} />}
        <Label
          htmlFor="title"
          className={`${errors?.title ? "text-destructive" : ""}`}
        >
          Name <RequiredFieldSymbol />
        </Label>
        <Input
          id="title"
          type="text"
          name="title"
          placeholder="e.g., Personal Tasks"
          defaultValue={boardFormData.title}
          onBlur={(e) => {
            handleOnBlur(router, e.target.value);
          }}
          onChange={(e) => handleOnChange("title", e.target.value)}
          aria-invalid={!!errors?.title}
          aria-describedby="title-error"
          aria-required
        />

        <p className="text-[0.8rem] text-muted-foreground">
          Choose a clear and descriptive name for your board.
        </p>
        {errors?.title && (
          <ErrorMessage id="title-error">{errors?.title}</ErrorMessage>
        )}
      </div>

      {!isEditMode && (
        <div>
          <Label htmlFor="template">Template</Label>
          <Select
            defaultValue="personal"
            name="template"
            onValueChange={(value) =>
              setColumns(constructColumns(value as Templates))
            }
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
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={boardFormData?.description ?? ""}
          onChange={(e) => handleOnChange("description", e.target.value)}
          placeholder="Organize my daily and work tasks"
          className="!mb-1 resize-none"
          aria-invalid={!!errors?.description}
          aria-describedby="description-error"
        />

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Add a context to help you remember the board&#39;s purpose.
          </p>
        </div>

        {errors?.description && (
          <ErrorMessage id="description-error">
            {errors?.description}
          </ErrorMessage>
        )}
      </div>
    </GenericForm>
  );
}
