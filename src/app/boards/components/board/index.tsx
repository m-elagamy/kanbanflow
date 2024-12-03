import DndProvider from "@/providers/dnd-provider";
import ColumnsWrapper from "../column";
import BoardHeader from "./board-header";

export default function BoardWrapper() {
  return (
    <div className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-4">
      <BoardHeader />
      <DndProvider>
        <ColumnsWrapper />
      </DndProvider>
    </div>
  );
}
