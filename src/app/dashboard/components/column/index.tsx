"use client";

import { useShallow } from "zustand/shallow";
import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
import useKanbanStore from "@/stores/kanban";

const ColumnsWrapper = () => {
  const columns = useKanbanStore(useShallow((state) => state.getColumns()));

  return (
    <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
      {columns?.map((column) => <ColumnCard key={column.id} column={column} />)}
      <ColumnModal />
    </div>
  );
};

export default ColumnsWrapper;
