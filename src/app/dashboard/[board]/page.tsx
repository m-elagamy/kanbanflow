import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoardBySlugAction } from "@/actions/board";
import deslugify from "@/utils/deslugify";
import BoardLayout from "../components/board";
import OptimisticBoardLayout from "../components/board/optimistic-board";
import { getTaskDetailsAction } from "@/actions/task";

type Params = Promise<{ board: string }>;
type SearchParams = Promise<{ new?: string; task?: string }>;

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const boardSlug = decodeURIComponent((await params).board);
  const { new: isFreshlyCreated, task: taskId } = await searchParams;

  const [{ board: currentBoard }, taskResult] = await Promise.all([
    getBoardBySlugAction(boardSlug),
    taskId ? getTaskDetailsAction(taskId) : Promise.resolve(null),
  ]);

  if (!currentBoard) {
    if (isFreshlyCreated) return <OptimisticBoardLayout />;
    notFound();
  }

  const linkedTask =
    taskResult?.success && taskResult.fields?.boardSlug === boardSlug
      ? taskResult.fields
      : null;

  return <BoardLayout initialBoard={currentBoard} linkedTask={linkedTask} />;
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
