import { useShallow } from "zustand/react/shallow";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndProvider } from "@/providers/dnd-provider";
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
  const columnIds = sortedColumns.map((column) => column.id);

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-3 pb-4 sm:gap-4 sm:px-4 md:justify-start">
      <DndProvider boardId={boardId}>
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          {sortedColumns?.map((column) => (
            <ColumnCard key={column.id} column={column} />
          ))}
        </SortableContext>
      </DndProvider>

      <ColumnModal boardId={boardId} />
    </div>
  );
};

export default ColumnsWrapper;
