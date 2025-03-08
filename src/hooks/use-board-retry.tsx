"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import useBoardStore from "@/stores/board";
import { useUpdatePredefinedColumnsId } from "@/hooks/use-update-predefined-columns-id";
import { createBoardAction } from "@/actions/board";
import delay from "@/utils/delay";
import InfoToast from "@/components/ui/info-toast";

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

  const navigateAndDeleteBoard = useCallback(
    async (success?: boolean) => {
      if (success || !failedBoard) return;

      router.push("/dashboard");
      await delay(500);
      deleteBoard(failedBoard.id);
    },
    [router, failedBoard, deleteBoard],
  );

  const retryBoardCreation = useCallback(async () => {
    if (!failedBoard) return;

    await delay(500);

    let success = false;

    toast.promise(
      async () => {
        const newBoard = await createBoardAction(failedBoard);

        if (!newBoard.fields) {
          throw new Error("Board creation returned invalid data");
        }

        updateBoardId(failedBoard.id, newBoard.fields.id);
        updateColumnIds(newBoard.fields.columns);

        resetError();
        await delay(500);

        success = true;
        return newBoard.fields;
      },
      {
        loading: "Attempting to create your board...",
        success: (fields) =>
          `Board "${fields.title}" is ready! Start organizing your tasks now.`,
        error:
          "Something went wrong while creating your board. Returning to the dashboard for now.",
        position: "top-center",
        finally: () => navigateAndDeleteBoard(success),
      },
    );
  }, [
    failedBoard,
    updateBoardId,
    updateColumnIds,
    resetError,
    navigateAndDeleteBoard,
  ]);

  const handleDismiss = useCallback(async () => {
    if (!failedBoard) return;

    await delay(500);
    InfoToast({
      message:
        "Your board creation failed. Would you like to retry or discard it?",
      duration: 10000,
      action: {
        label: "Retry",
        onClick: retryBoardCreation,
      },
    });

    setTimeout(async () => {
      await navigateAndDeleteBoard();

      await delay(300);
      InfoToast({
        message:
          "The failed board has been discarded. You're back on the dashboard.",
      });
    }, 10000);
  }, [failedBoard, retryBoardCreation, navigateAndDeleteBoard]);

  useEffect(() => {
    if (!hasError) return;

    const id = toast.error("Unable to Create Board", {
      description:
        "An error occurred while creating your board. Please try again.",
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      position: "top-center",
      duration: Infinity,
      action: {
        label: "Retry",
        onClick: retryBoardCreation,
      },
      onDismiss: handleDismiss,
      closeButton: true,
    });

    return () => {
      if (id) toast.dismiss(id);
    };
  }, [
    hasError,
    retryBoardCreation,
    failedBoard,
    router,
    deleteBoard,
    handleDismiss,
  ]);

  return {
    hasError,
    failedBoard,
    retryBoardCreation,
    isRetryAvailable: !!failedBoard,
  };
}
