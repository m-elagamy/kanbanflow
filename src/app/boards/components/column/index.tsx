import { useCallback } from "react";
import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
import useKanbanStore from "@/stores/use-kanban-store";

const ColumnsWrapper = () => {
  const columns = useKanbanStore(
    useCallback((state) => state.getColumns(), []),
  );

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      {columns?.map((column) => <ColumnCard key={column.id} column={column} />)}
      <ColumnModal />
    </div>
  );
};

export default ColumnsWrapper;
