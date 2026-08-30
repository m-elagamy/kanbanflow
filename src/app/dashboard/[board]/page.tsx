import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoardBySlugAction } from "@/actions/board";
import deslugify from "@/utils/deslugify";
import BoardLayout from "../components/board";
import OptimisticBoardLayout from "../components/board/optimistic-board";

type Params = Promise<{ board: string }>;
type SearchParams = Promise<{ new?: string }>;

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const boardSlug = decodeURIComponent((await params).board);
  const { new: isFreshlyCreated } = await searchParams;

  const { board: currentBoard } = await getBoardBySlugAction(boardSlug);

  if (!currentBoard) {
    if (isFreshlyCreated) return <OptimisticBoardLayout />;
    notFound();
  }

  return <BoardLayout initialBoard={currentBoard} />;
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
