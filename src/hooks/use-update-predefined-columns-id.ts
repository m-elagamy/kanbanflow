import { useColumnStore } from "@/stores/column";
import { Column } from "@prisma/client";

export const useUpdatePredefinedColumnsId = () => {
  const updatePredefinedColumnsId = useColumnStore(
    (state) => state.updateColumnIds,
  );

  const updateColumnId = (boardId: string, columns: Column[]) => {
    const columnUpdates = columns.map((column, index) => ({
      boardId,
      tempId: `temp-${index}`,
      realId: column.id,
    }));

    updatePredefinedColumnsId(columnUpdates);
  };

  return updateColumnId;
};
