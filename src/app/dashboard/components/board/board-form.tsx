import { useRouter } from "next/navigation";
import type { Board } from "@prisma/client";
import type { FormMode, Templates } from "@/lib/types";

import {
  constructColumns,
  createOptimisticBoard,
  handleOnBlur,
} from "@/utils/board-helpers";
import { slugify } from "@/utils/slugify";
import { createBoardAction, updateBoardAction } from "@/actions/board";
import { boardSchema, type BoardFormSchema } from "@/schemas/board";
import { omit } from "@/utils/object";
import { useBoardFormStore } from "@/hooks/use-board-form-store";
import useForm from "@/hooks/use-form";
import handleOnError from "@/utils/handle-on-error";
import GenericForm from "@/components/ui/generic-form";
import FormField from "@/components/ui/form-field";
import { useUpdatePredefinedColumnsId } from "@/hooks/use-update-predefined-columns-id";
import delay from "@/utils/delay";
import columnsTemplates from "../../data/columns-templates";

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
    setError,
  } = useBoardFormStore();

  const updateColumnIds = useUpdatePredefinedColumnsId();

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
      <FormField
        name="title"
        type="text"
        label="Name"
        defaultValue={board?.title}
        placeholder="e.g., Personal Tasks"
        required
        onChange={(value) => handleOnChange("title", value)}
        onBlur={(value) => handleOnBlur(router, value)}
        error={errors?.title}
        helperText="Choose a clear and descriptive name for your board."
      />

      {!isEditMode && (
        <FormField
          name="template"
          type="select"
          label="Template"
          defaultValue="personal"
          options={columnsTemplates}
          error={errors?.template}
          helperText="Start with a ready-made template or customize it later."
        />
      )}

      <FormField
        name="description"
        type="textarea"
        label="Description"
        placeholder="Organize my daily and work tasks"
        defaultValue={boardFormData?.description ?? ""}
        error={errors?.description}
        helperText="Add a context to help you remember the board's purpose."
        onChange={(value) => handleOnChange("description", value)}
      />

      {isEditMode && (
        <FormField type="hidden" name="id" defaultValue={board?.id} />
      )}
    </GenericForm>
  );
}
