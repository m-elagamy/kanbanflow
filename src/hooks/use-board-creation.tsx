"use client";

import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import useLoadingStore from "@/stores/loading";
import { createBoardAction } from "@/actions/board";
import type { BoardFormValues } from "@/lib/types";

export function useBoardCreation() {
  const router = useRouter();
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
    if (useLoadingStore.getState().isLoading("board", "creating")) return false;
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
      router.push(`/dashboard/${slug}?new=1`);
      return true;
    } catch {
      setError(true, attempt);
      return false;
    } finally {
      setIsLoading("board", "creating", false, attempt.id);
    }
  };

  const retryBoardCreation = async () => {
    if (!failedBoard) return false;
    return submitBoardCreation(failedBoard);
  };

  const navigateToDashboard = () => {
    if (isCreating) return;
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
