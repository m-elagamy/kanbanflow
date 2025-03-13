import { useRouter } from "next/navigation";
import { constructColumns, createOptimisticBoard } from "@/utils/board-helpers";
import delay from "@/utils/delay";
import { omit } from "@/utils/object";
import type { BoardSummary, FormMode, Templates } from "@/lib/types";
import type { BoardFormSchema } from "@/schemas/board";
import handleOnError from "@/utils/handle-on-error";
import { useUpdatePredefinedColumnsId } from "./use-update-predefined-columns-id";
import { useBoardFormStore } from "./use-board-form-store";
import { createBoardAction, updateBoardAction } from "@/actions/board";

type UseBoardFormAction = {
  formMode: FormMode;
  validateBeforeSubmit: (
    formData: FormData,
    isEditMode: boolean,
    existingBoards: { id: string; title: string }[],
    subsetFields: (keyof BoardFormSchema)[],
  ) => { success: boolean; data?: BoardFormSchema; error?: string };
  board?: BoardSummary;
  existingBoards: { id: string; title: string }[];
  modalId: string;
};

export function useBoardFormAction({
  formMode,
  validateBeforeSubmit,
  board,
  existingBoards,
  modalId,
}: UseBoardFormAction) {
  const isEditMode = formMode === "edit";
  const router = useRouter();

  const {
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

  const handleFormAction = async (formData: FormData) => {
    const { success, data: validatedData } = validateBeforeSubmit(
      formData,
      isEditMode,
      existingBoards,
      ["title", "description"],
    );

    if (!success || !validatedData) return;

    const { title, description = "", template } = validatedData;

    const optimisticBoard = createOptimisticBoard(title, description ?? "");

    if (isEditMode && board) {
      setIsLoading("board", "updating", true, board.id);

      await delay(500);
      updateBoard(board.id, omit(optimisticBoard, ["id"]));
      closeModal("board", modalId);

      try {
        await updateBoardAction(formData);
        if (board.slug !== optimisticBoard.slug && activeBoardId === board.id) {
          router.replace(`/dashboard/${optimisticBoard.slug}`);
        }
      } catch (error) {
        console.error(error);
        handleOnError(error, "Failed to update board");
        updateBoard(board.id, board);
      } finally {
        setIsLoading("board", "updating", false, board.id);
      }

      return;
    }

    setIsLoading("board", "creating", true, optimisticBoard.id);
    createBoard(optimisticBoard);
    setColumns(optimisticBoard.id, constructColumns(template as Templates));

    await delay(600);
    router.push(`/dashboard/${optimisticBoard.slug}`);

    setTimeout(async () => {
      try {
        const res = await createBoardAction(validatedData);
        if (res.fields) {
          updateBoardId(optimisticBoard.id, res.fields.id);
          updateColumnIds(res.fields.id, res.fields.columns);
        }
      } catch (err) {
        console.error(err);
        setError(true, {
          id: optimisticBoard.id,
          title,
          description,
          template: validatedData.template,
        });
      } finally {
        setIsLoading("board", "creating", false, optimisticBoard.id);
      }
    }, 50);
  };

  return { handleFormAction, isEditMode, router, isLoading };
}
