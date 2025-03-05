import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import isEqual from "fast-deep-equal";
import { Column } from "@prisma/client";

interface ColumnWithTempId extends Omit<Column, "id" | "order"> {
  id: string;
  tempId?: string;
}

type ColumnState = {
  columns: Record<string, ColumnWithTempId>;
  tempToRealIdMap: Record<string, string>;
  previousState: Record<string, ColumnWithTempId> | null;
  setColumns: (columns: ColumnWithTempId[]) => void;
  addColumn: (column: ColumnWithTempId) => void;
  updateColumn: (columnId: string, updates: Pick<Column, "status">) => void;
  deleteColumn: (columnId: string) => void;
  revertToPrevious: () => void;
  backupState: () => void;
  updateColumnId: (tempId: string, realId: string | undefined) => void;
  updateColumnIds: (
    columnUpdates: { boardId: string; tempId: string; realId: string }[],
  ) => void;
};

export const useColumnStore = create<ColumnState>()(
  immer((set) => ({
    columns: {},
    tempToRealIdMap: {},
    previousState: null,

    setColumns: (columns) => {
      set((state) => {
        const newColumns = columns.reduce<Record<string, ColumnWithTempId>>(
          (acc, col) => {
            acc[col.id] = col;
            return acc;
          },
          {},
        );

        if (isEqual(state.columns, newColumns)) return state;

        return { columns: newColumns };
      });
    },

    addColumn: (column) => {
      set((state) => {
        state.previousState = { ...state.columns };
        if (column.tempId) {
          state.columns[column.tempId] = column;
        } else {
          state.columns[column.id] = column;
        }
      });
    },

    updateColumnId: (tempId, realId) => {
      set((state) => {
        const column = state.columns[tempId];
        if (column && realId) {
          // Create new column with real ID
          state.columns[realId] = {
            ...column,
            id: realId,
            tempId: undefined,
          };
          // Delete the temporary entry
          delete state.columns[tempId];
          // Update the mapping
          state.tempToRealIdMap[tempId] = realId;
        }
      });
    },

    /** ✅ Update column ID after creation */
    updateColumnIds: (columnUpdates) =>
      set((state) => {
        const updatedColumns = { ...state.columns };

        columnUpdates.forEach(({ boardId, tempId, realId }) => {
          if (updatedColumns[tempId]) {
            updatedColumns[realId] = {
              ...updatedColumns[tempId],
              boardId,
              id: realId,
            };
            delete updatedColumns[tempId]; // Remove temporary ID
          }
        });

        return { columns: updatedColumns };
      }),

    updateColumn: (columnId, updates) => {
      set((state) => {
        state.previousState = { ...state.columns };
        const realId = state.tempToRealIdMap[columnId] || columnId;
        if (state.columns[realId]) {
          state.columns[realId] = {
            ...state.columns[realId],
            ...updates,
          };
        }
      });
    },

    deleteColumn: (columnId) => {
      set((state) => {
        state.previousState = { ...state.columns };
        const realId = state.tempToRealIdMap[columnId] || columnId;
        delete state.columns[realId];
      });
    },

    backupState: () => {
      set((state) => {
        state.previousState = { ...state.columns };
      });
    },

    revertToPrevious: () => {
      set((state) => {
        if (state.previousState) {
          state.columns = { ...state.previousState };
          state.previousState = null;
        }
      });
    },
  })),
);
