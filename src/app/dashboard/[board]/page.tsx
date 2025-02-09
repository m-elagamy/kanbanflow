import { notFound, unauthorized } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getBoardBySlugAction } from "@/actions/board";
import ColumnsWrapper from "../components/column";
import BoardHeader from "../components/board/board-header";

type Params = Promise<{ board: string }>;

export default async function Board({ params }: { params: Params }) {
  const user = await currentUser();

  if (!user) {
    return unauthorized();
  }

  const { board } = await params;

  const { board: currentBoard } = await getBoardBySlugAction(user.id, board);

  if (!currentBoard) {
    notFound();
  }

  return (
    <div className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-0 md:px-4">
      <BoardHeader
        boardId={currentBoard.id}
        boardTitle={currentBoard.title}
        boardDescription={currentBoard.description}
        boardSlug={currentBoard.slug}
      />
      <ColumnsWrapper
        columns={currentBoard.columns}
        boardId={currentBoard.id}
        boardSlug={currentBoard.slug}
      />
    </div>
  );
}
