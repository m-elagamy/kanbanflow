import { useActionState, useState } from "react";
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
  onClose: () => void;
};

export function useBoardFormAction({
  formMode,
  validateBeforeSubmit,
  board,
  existingBoards,
  onClose,
}: UseBoardFormAction) {
  const isEditMode = formMode === "edit";
  const router = useRouter();

  const { updateBoard, activeBoardId } = useBoardFormStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    hasError,
    failedBoard,
    submitBoardCreation,
    retryBoardCreation,
    navigateToDashboard,
    isCreating,
  } = useBoardCreation();
  const [, createFormAction, isCreatePending] = useActionState(
    async (_previousState: null, formData: FormData) => {
      if (isEditMode || failedBoard) return null;

      const { success, data: validatedData } = validateBeforeSubmit(
        formData,
        false,
        existingBoards,
        ["title", "description"],
      );

      if (!success || !validatedData) return null;

      const optimisticBoard = createOptimisticBoard(
        validatedData.title,
        validatedData.description ?? "",
      );
      const created = await submitBoardCreation({
        ...validatedData,
        id: optimisticBoard.id,
      });
      if (created) onClose();

      return null;
    },
    null,
  );
  const isLoading = isEditMode ? isUpdating : isCreatePending || isCreating;

  const handleFormAction = async (formData: FormData) => {
    if (!isEditMode || !board || isLoading) return;
    const { success, data: validatedData } = validateBeforeSubmit(
      formData,
      isEditMode,
      existingBoards,
      ["title", "description"],
    );

    if (!success || !validatedData) return;

    const { title, description = "" } = validatedData;

    const optimisticBoard = createOptimisticBoard(title, description ?? "");
    setIsUpdating(true);

    updateBoard(board.id, omit(optimisticBoard, ["id"]));
    onClose();

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
      setIsUpdating(false);
    }
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
    handleFormAction: isEditMode ? handleFormAction : createFormAction,
    isEditMode,
    router,
    isLoading,
    hasCreationError: !isEditMode && hasError && !!failedBoard,
    retryCreation: async () => {
      if (await retryBoardCreation()) onClose();
    },
    returnToDashboard: () => {
      if (isLoading) return;
      onClose();
      navigateToDashboard();
    },
  };
}
