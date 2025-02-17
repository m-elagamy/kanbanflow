import { notFound } from "next/navigation";
import { getBoardBySlugAction } from "@/actions/board";
import BoardHeader from "./board-header";
import ColumnsWrapper from "../column";

type BoardContentProps = {
  userId: string;
  boardSlug: string;
};

export default async function BoardContent({
  userId,
  boardSlug,
}: BoardContentProps) {
  const { board: currentBoard } = await getBoardBySlugAction(userId, boardSlug);

  if (!currentBoard) notFound();

  return (
    <div className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-0 md:px-4">
      <BoardHeader
        boardId={currentBoard.id}
        boardTitle={currentBoard.title}
        boardDescription={currentBoard.description}
      />
      <ColumnsWrapper
        columns={currentBoard.columns}
        boardId={currentBoard.id}
        boardSlug={currentBoard.slug}
      />
    </div>
  );
}
