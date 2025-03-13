import DndProvider from "@/providers/dnd-provider";
import { useColumnStore } from "@/stores/column";
import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";

type ColumnsWrapperProps = {
  boardId: string;
};

const ColumnsWrapper = ({ boardId }: ColumnsWrapperProps) => {
  const columns = useColumnStore(
    (state) => state.columnsByBoard[boardId] || {},
  );

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      <DndProvider>
        {Object.values(columns)?.map((column) => (
          <ColumnCard key={column.id} column={column} />
        ))}
      </DndProvider>

      <ColumnModal boardId={boardId} />
    </div>
  );
};

export default ColumnsWrapper;
