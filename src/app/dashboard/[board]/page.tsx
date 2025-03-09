import { unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getBoardBySlugAction } from "@/actions/board";
import BoardLayout from "../components/board";
import OptimisticBoardLayout from "../components/board/optimistic-board";

type Params = Promise<{ board: string }>;

export default async function BoardPage({ params }: { params: Params }) {
  const { userId } = await auth();

  if (!userId) unauthorized();

  const boardSlug = decodeURIComponent((await params).board);

  const { board: currentBoard } = await getBoardBySlugAction(userId, boardSlug);

  if (!currentBoard) return <OptimisticBoardLayout />;

  return <BoardLayout initialBoard={currentBoard} />;
}

export const metadata: Metadata = {
  title: "Board",
  description: "Manage your tasks with a modern Kanban board.",
};
