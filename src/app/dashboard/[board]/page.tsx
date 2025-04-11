import type { Metadata } from "next";
import { getBoardBySlugAction } from "@/actions/board";
import deslugify from "@/utils/deslugify";
import BoardLayout from "../components/board";
import OptimisticBoardLayout from "../components/board/optimistic-board";

type Params = Promise<{ board: string }>;

export default async function BoardPage({ params }: { params: Params }) {
  const boardSlug = decodeURIComponent((await params).board);

  const { board: currentBoard } = await getBoardBySlugAction(boardSlug);

  if (!currentBoard) return <OptimisticBoardLayout />;

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
