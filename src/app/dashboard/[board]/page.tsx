import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoardBySlugAction } from "@/actions/board";
import deslugify from "@/utils/deslugify";
import BoardLayout from "../components/board";
import OptimisticBoardLayout from "../components/board/optimistic-board";
import { getTaskDetailsAction } from "@/actions/task";

type Params = Promise<{ board: string }>;
type SearchParams = Promise<{ new?: string; task?: string; focus?: string }>;

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const boardSlug = decodeURIComponent((await params).board);
  const {
    new: isFreshlyCreated,
    task: taskId,
    focus: focusedTaskId,
  } = await searchParams;

  if (isFreshlyCreated) return <OptimisticBoardLayout />;

  const requestedTaskId = taskId ?? focusedTaskId;

  const [{ board: currentBoard }, taskResult] = await Promise.all([
    getBoardBySlugAction(boardSlug),
    requestedTaskId
      ? getTaskDetailsAction(requestedTaskId)
      : Promise.resolve(null),
  ]);

  if (!currentBoard) {
    notFound();
  }

  const requestedTask =
    taskResult?.success && taskResult.fields?.boardSlug === boardSlug
      ? taskResult.fields
      : null;
  const linkedTask = taskId ? requestedTask : null;
  const focusedTask = focusedTaskId ? requestedTask : null;

  const initialBoard = focusedTask
    ? {
        ...currentBoard,
        columns: currentBoard.columns.map((column) =>
          column.id === focusedTask.columnId &&
          !column.tasks.some((task) => task.id === focusedTask.id)
            ? {
                ...column,
                tasks: [...column.tasks, focusedTask].sort((a, b) =>
                  a.order.localeCompare(b.order),
                ),
              }
            : column,
        ),
      }
    : currentBoard;

  return (
    <BoardLayout
      key={`${boardSlug}:${taskId ?? focusedTaskId ?? ""}`}
      initialBoard={initialBoard}
      linkedTask={linkedTask}
      focusedTaskId={focusedTask?.id}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const boardSlug = decodeURIComponent((await params).board);

  const boardTitle = deslugify(boardSlug);

  return {
    title: boardTitle,
  };
}
