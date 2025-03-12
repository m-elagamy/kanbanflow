import { unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getBoardBySlugAction } from "@/actions/board";
import deslugify from "@/utils/deslugify";
import BoardLayout from "../components/board";
import OptimisticBoardLayout from "../components/board/optimistic-board";

type Params = Promise<{ board: string }>;

export default async function BoardPage({ params }: { params: Params }) {
  const [authResult, boardSlug] = await Promise.all([
    auth(),
    decodeURIComponent((await params).board),
  ]);

  if (!authResult.userId) unauthorized();

  const { board: currentBoard } = await getBoardBySlugAction(
    authResult.userId,
    boardSlug,
  );

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
