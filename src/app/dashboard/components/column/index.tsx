import { useShallow } from "zustand/react/shallow";
import DndProvider from "@/providers/dnd-provider";
import { useColumnStore } from "@/stores/column";
import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
type ColumnsWrapperProps = {
  boardId: string;
};

const ColumnsWrapper = ({ boardId }: ColumnsWrapperProps) => {
  const columns = useColumnStore(
    useShallow((state) => state.columnsByBoard[boardId] || {}),
  );

  const sortedColumns = Object.values(columns).sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      <DndProvider>
        {sortedColumns?.map((column) => (
          <ColumnCard key={column.id} column={column} />
        ))}
      </DndProvider>

      <ColumnModal boardId={boardId} />
    </div>
  );
};

export default ColumnsWrapper;
