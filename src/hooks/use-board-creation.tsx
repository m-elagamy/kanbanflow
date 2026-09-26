"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useBoardStore from "@/stores/board";
import { useColumnStore } from "@/stores/column";
import { createBoardAction } from "@/actions/board";
import type { BoardFormValues } from "@/lib/types";

type UseBoardCreationOptions = {
  animateOnCreate?: boolean;
};

export function useBoardCreation({
  animateOnCreate = false,
}: UseBoardCreationOptions = {}) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [failedBoard, setFailedBoard] = useState<BoardFormValues | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const createBoard = useBoardStore((state) => state.createBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const setColumns = useColumnStore((state) => state.setColumns);

  const submitBoardCreation = async (attempt: BoardFormValues) => {
    if (isCreating) return false;
    setIsCreating(true);

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
      setHasError(false);
      setFailedBoard(null);
      router.push(
        animateOnCreate
          ? `/dashboard/${slug}?new=1`
          : `/dashboard/${slug}?created=1`,
      );
      return true;
    } catch {
      setHasError(true);
      setFailedBoard(attempt);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const retryBoardCreation = async () => {
    if (!failedBoard) return false;
    return submitBoardCreation(failedBoard);
  };

  const navigateToDashboard = () => {
    if (isCreating) return;
    if (failedBoard) deleteBoard(failedBoard.id);
    setHasError(false);
    setFailedBoard(null);
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
