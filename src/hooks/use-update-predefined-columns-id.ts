import { useColumnStore } from "@/stores/column";
import { Column } from "@prisma/client";

export const useUpdatePredefinedColumnsId = () => {
  const updatePredefinedColumnsId = useColumnStore(
    (state) => state.updatePredefinedColumnsId,
  );

  const updateColumnId = (columns: Column[]) => {
    const columnUpdates = columns.map((column, index) => ({
      oldId: `temp-${index}`,
      newId: column.id,
    }));

    updatePredefinedColumnsId(columnUpdates);
  };

  return updateColumnId;
};
