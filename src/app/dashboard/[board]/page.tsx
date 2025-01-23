import { getBoardBySlugAction } from "@/actions/board";
import { notFound } from "next/navigation";
import DndProvider from "@/providers/dnd-provider";
import ColumnsWrapper from "../components/column";
import BoardHeader from "../components/board/board-header";

type Params = Promise<{ board: string }>;

export default async function Board({ params }: { params: Params }) {
  const { board } = await params;

  const { board: currentBoard } = await getBoardBySlugAction(board);

  if (!currentBoard) {
    notFound();
  }

  return (
    <div className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-0 md:px-4">
      <BoardHeader
        id={currentBoard.id}
        title={currentBoard.title}
        description={currentBoard.description}
      />
      <DndProvider>
        <ColumnsWrapper
          columns={currentBoard.columns}
          boardId={currentBoard.id}
        />
      </DndProvider>
    </div>
  );
}
