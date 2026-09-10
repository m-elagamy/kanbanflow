"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import useLoadingStore from "@/stores/loading";
import { createBoardAction } from "@/actions/board";
import type { BoardFormValues } from "@/lib/types";

export function useBoardRetry() {
  const router = useRouter();
  const inFlight = useRef(false);
  const {
    hasError,
    failedBoard,
    resetError,
    setError,
    createBoard,
    deleteBoard,
  } = useBoardStore(
    useShallow((state) => ({
      hasError: state.hasError,
      failedBoard: state.failedBoard,
      resetError: state.resetError,
      setError: state.setError,
      createBoard: state.createBoard,
      deleteBoard: state.deleteBoard,
    })),
  );
  const setColumns = useColumnStore((state) => state.setColumns);
  const isCreating = useLoadingStore((state) =>
    state.isLoading("board", "creating"),
  );
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const submitBoardCreation = async (attempt: BoardFormValues) => {
    if (
      inFlight.current ||
      useLoadingStore.getState().isLoading("board", "creating")
    )
      return false;
    inFlight.current = true;
    setIsLoading("board", "creating", true, attempt.id);

    try {
      const result = await createBoardAction(attempt, attempt.id);
      if (!result.success || !result.fields?.id) {
        throw new Error(
          result.message || "Could not confirm that your board was saved.",
        );
      }

      const { id, title, slug, description, columns } = result.fields;
      deleteBoard(attempt.id);
      createBoard({ id, title, slug, description });
      setColumns(id, columns);
      resetError();
      toast.success(`Board "${title}" is ready.`);
      router.push(`/dashboard/${slug}`);
      router.refresh();
      return true;
    } catch (error) {
      setError(true, attempt);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not confirm that your board was saved. Please retry.",
      );
      return false;
    } finally {
      inFlight.current = false;
      setIsLoading("board", "creating", false, attempt.id);
    }
  };

  const retryBoardCreation = async () => {
    if (!failedBoard) return false;
    return submitBoardCreation(failedBoard);
  };

  const navigateToDashboard = () => {
    if (inFlight.current || isCreating) return;
    if (failedBoard) deleteBoard(failedBoard.id);
    resetError();
    router.push("/dashboard");
    router.refresh();
  };

  return {
    hasError,
    failedBoard,
    isCreating,
    submitBoardCreation,
    retryBoardCreation,
    navigateToDashboard,
    isRetryAvailable: !!failedBoard && !isCreating,
  };
}
