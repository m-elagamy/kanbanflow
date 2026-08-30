import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useColumnStore } from "@/stores/column";
import { updateColumnPositionAction } from "@/actions/column";
import handleOnError from "@/utils/handle-on-error";
import type { SimplifiedColumn } from "@/lib/types/stores/column";

const useColumnDndHandlers = (boardId: string) => {
  const [activeColumn, setActiveColumn] = useState<SimplifiedColumn | null>(
    null,
  );

  const { columnsByBoard, reorderColumns, rollbackReorder } = useColumnStore(
    useShallow((state) => ({
      columnsByBoard: state.columnsByBoard,
      reorderColumns: state.reorderColumns,
      rollbackReorder: state.rollbackReorder,
    })),
  );

  const handleColumnDragStart = ({ active }: DragStartEvent) => {
    const columns = columnsByBoard[boardId] || {};
    const column = columns[String(active.id)];

    if (column) setActiveColumn(column);
  };

  const handleColumnDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveColumn(null);

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const columns = columnsByBoard[boardId] || {};
    const sorted = Object.values(columns).sort((a, b) => a.order - b.order);
    const activeIndex = sorted.findIndex((column) => column.id === activeId);
    const overIndex = sorted.findIndex((column) => column.id === overId);

    if (activeIndex === -1 || overIndex === -1) return;

    const reordered = [...sorted];
    const [moved] = reordered.splice(activeIndex, 1);
    reordered.splice(overIndex, 0, moved);
    const newColumnOrder = reordered.map((column) => column.id);

    reorderColumns(boardId, activeId, overId);

    updateColumnPositionAction(boardId, newColumnOrder)
      .then((result) => {
        if (!result.success) {
          handleOnError(result.message, "Failed to reorder columns");
          rollbackReorder();
        }
      })
      .catch((error) => {
        handleOnError(error, "Failed to reorder columns");
        rollbackReorder();
      });
  };

  const handleColumnDragCancel = () => setActiveColumn(null);

  return {
    activeColumn,
    handleColumnDragStart,
    handleColumnDragEnd,
    handleColumnDragCancel,
  };
};

export default useColumnDndHandlers;
