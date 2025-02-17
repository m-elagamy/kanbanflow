import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import BoardContent from "../components/board";

type Params = Promise<{ board: string }>;

export default async function Board({ params }: { params: Params }) {
  const { userId } = await auth();

  if (!userId) unauthorized();

  const { board } = await params;

  return <BoardContent userId={userId} boardSlug={board} />;
}
