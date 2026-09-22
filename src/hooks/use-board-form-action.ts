import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOptimisticBoard } from "@/utils/board-helpers";
import { omit } from "@/utils/object";
import type { BoardSummary, FormMode } from "@/lib/types";
import type { BoardFormSchema } from "@/schemas/board";
import handleOnError from "@/utils/handle-on-error";
import { useBoardCreation } from "./use-board-creation";
import { useBoardFormStore } from "./use-board-form-store";
import { updateBoardAction } from "@/actions/board";

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

  const { updateBoard, activeBoardId, closeModal, isLoading, setIsLoading } =
    useBoardFormStore();

  const {
    hasError,
    failedBoard,
    submitBoardCreation,
    retryBoardCreation,
    navigateToDashboard,
  } = useBoardCreation();

  const handleFormAction = async (formData: FormData) => {
    if (isLoading || (!isEditMode && failedBoard)) return;
    const { success, data: validatedData } = validateBeforeSubmit(
      formData,
      isEditMode,
      existingBoards,
      ["title", "description"],
    );

    if (!success || !validatedData) return;

    const { title, description = "" } = validatedData;

    const optimisticBoard = createOptimisticBoard(title, description ?? "");

    if (isEditMode && board) {
      setIsLoading("board", "updating", true, board.id);

      updateBoard(board.id, omit(optimisticBoard, ["id"]));
      closeModal("board", modalId);

      try {
        const result = await updateBoardAction(formData);

        if (!result.success) {
          handleOnError(result.message, "Failed to update board");
          updateBoard(board.id, board);
        } else {
          redirectIfSlugChanged(
            board.slug,
            optimisticBoard.slug,
            board.id,
            activeBoardId,
          );
          toast.success(result.message);
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

    const created = await submitBoardCreation({
      ...validatedData,
      id: optimisticBoard.id,
    });
    if (created) closeModal("board", modalId);
  };

  const redirectIfSlugChanged = (
    boardSlug: string,
    newSlug: string,
    boardId: string,
    currentBoardId: string | null,
  ) => {
    if (boardSlug !== newSlug && currentBoardId === boardId) {
      setTimeout(() => {
        router.replace(`/dashboard/${newSlug}`);
      }, 0);
    }
  };

  return {
    handleFormAction,
    isEditMode,
    router,
    isLoading,
    hasCreationError: !isEditMode && hasError && !!failedBoard,
    retryCreation: async () => {
      if (await retryBoardCreation()) closeModal("board", modalId);
    },
    returnToDashboard: () => {
      if (isLoading) return;
      closeModal("board", modalId);
      navigateToDashboard();
    },
  };
}
