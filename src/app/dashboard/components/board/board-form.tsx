"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

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
import HelperText from "@/components/ui/helper-text";
import { MotionInput } from "@/components/ui/motion-input";
import { useUpdatePredefinedColumnsId } from "@/hooks/use-update-predefined-columns-id";
import delay from "@/utils/delay";
import columnsTemplates from "../../data/columns-templates";
import useBoardStore from "@/stores/board";

type BoardFormProps = Readonly<{
  formMode: FormMode;
  board?: Pick<Board, "id" | "title" | "description" | "slug">;
  modalId: string;
}>;

export default function BoardForm({
  formMode,
  board,
  modalId,
}: BoardFormProps) {
  const isEditMode = formMode === "edit";

  const router = useRouter();

  const {
    boards,
    createBoard,
    updateBoard,
    updateBoardId,
    activeBoardId,
    setColumns,
    closeModal,
    isLoading,
    setIsLoading,
  } = useBoardFormStore();

  const updateColumnIds = useUpdatePredefinedColumnsId();
  const setError = useBoardStore((state) => state.setError);

  const {
    formValues: boardFormData,
    handleOnChange,
    formRef,
    errors,
    validateBeforeSubmit,
  } = useForm<BoardFormSchema>(
    {
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

    const { title, description = "", template } = validatedData;

    const slug = slugify(title);

    const optimisticBoard = createOptimisticBoard(title, description ?? "");

    if (isEditMode && board) {
      updateBoard(board?.id, omit(optimisticBoard, ["id"]));
      closeModal("board", modalId);

      try {
        const res = await updateBoardAction(formData);
        const isSlugChanged = res.fields?.slug !== board?.slug;
        const isActiveBoard = activeBoardId === board.id;

        if (isSlugChanged && isActiveBoard) {
          router.replace(`/dashboard/${res.fields?.slug}`);
        }
      } catch (error) {
        handleOnError(error, "Failed to update board.");
        updateBoard(board.id, board);
      }

      return;
    }

    setIsLoading("board", "creating", true, optimisticBoard.id);

    createBoard(optimisticBoard);
    setColumns(constructColumns(template as Templates));

    await delay(300);
    router.push(`/dashboard/${slug}`);

    setTimeout(async () => {
      try {
        const res = await createBoardAction(validatedData);
        if (res.fields) {
          updateBoardId(optimisticBoard.id, res.fields.id);
          updateColumnIds(res.fields.id, res.fields.columns);
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        setError(true, {
          id: optimisticBoard.id,
          title: optimisticBoard.title,
          description: optimisticBoard.description,
          template: validatedData.template,
        });
      } finally {
        setIsLoading("board", "creating", false, optimisticBoard.id);
      }
    }, 50);
  };

  return (
    <GenericForm
      formRef={formRef}
      onAction={handleFormAction}
      formMode={formMode}
      errors={errors}
      isLoading={isLoading}
    >
      <div>
        {isEditMode && <Input type="hidden" name="boardId" value={board?.id} />}
        <Label
          htmlFor="title"
          className={`${errors?.title ? "text-destructive" : ""} transition-colors`}
        >
          Name <RequiredFieldSymbol />
        </Label>
        <MotionInput
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
          animate={errors?.title ? { x: [-2, 2, -2, 2, 0] } : undefined}
          transition={{ duration: 0.2 }}
        />
        <HelperText error={!!errors?.title}>
          Choose a clear and descriptive name for your board.
        </HelperText>
        <AnimatePresence>
          {errors?.title && (
            <ErrorMessage id="title-error">{errors.title}</ErrorMessage>
          )}
        </AnimatePresence>
      </div>

      {!isEditMode && (
        <div>
          <Label htmlFor="template">Template</Label>
          <Select defaultValue="personal" name="template">
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
          <HelperText>
            Start with a ready-made template or customize it later.
          </HelperText>
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

        <HelperText>
          Add a context to help you remember the board&#39;s purpose.
        </HelperText>

        <AnimatePresence>
          {errors?.description && (
            <ErrorMessage id="description-error">
              {errors?.description}
            </ErrorMessage>
          )}
        </AnimatePresence>
      </div>
    </GenericForm>
  );
}
