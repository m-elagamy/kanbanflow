"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import useBoardStore from "@/stores/board";
import { useUpdatePredefinedColumnsId } from "@/hooks/use-update-predefined-columns-id";
import { createBoardAction } from "@/actions/board";
import delay from "@/utils/delay";
import BoardErrorCard from "@/components/ui/board-error-card";

export function useBoardRetry() {
  const router = useRouter();

  const { hasError, failedBoard, resetError, updateBoardId, deleteBoard } =
    useBoardStore(
      useShallow((state) => ({
        hasError: state.hasError,
        failedBoard: state.failedBoard,
        resetError: state.resetError,
        updateBoardId: state.updateBoardId,
        deleteBoard: state.deleteBoard,
      })),
    );
  const updateColumnIds = useUpdatePredefinedColumnsId();

  const navigateToDashboard = useCallback(async () => {
    if (!failedBoard?.id) return;

    router.push("/dashboard");
    await delay(500);
    deleteBoard(failedBoard.id);
  }, [router, failedBoard?.id, deleteBoard]);

  const retryBoardCreation = useCallback(async () => {
    if (!failedBoard) return;

    await delay(500);

    const promise = toast.promise(
      async () => {
        const result = await createBoardAction(failedBoard);

        if (!result.fields) return;

        updateBoardId(failedBoard.id, result.fields.id);
        updateColumnIds(failedBoard.id, result.fields.columns);

        resetError();
        await delay(500);

        return result;
      },
      {
        loading: "Attempting to create your board...",
        success: (result) =>
          `Board "${result?.fields?.title}" is ready! Start organizing your tasks now.`,
        error: "Board creation failed. Redirecting to the dashboard...",
        position: "top-center",
      },
    );

    promise.unwrap().catch(() => navigateToDashboard());
  }, [
    failedBoard,
    updateBoardId,
    updateColumnIds,
    resetError,
    navigateToDashboard,
  ]);

  useEffect(() => {
    if (!hasError) return;

    const id = toast.custom(
      (id) => (
        <BoardErrorCard
          onRetry={() => {
            toast.dismiss(id);
            retryBoardCreation();
          }}
        />
      ),
      {
        position: "top-center",
        duration: Infinity,
      },
    );
    return () => {
      if (id) toast.dismiss(id);
    };
  }, [hasError, retryBoardCreation, failedBoard, router, deleteBoard]);

  return {
    hasError,
    failedBoard,
    retryBoardCreation,
    isRetryAvailable: !!failedBoard,
  };
}
