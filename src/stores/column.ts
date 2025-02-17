import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Column } from "@prisma/client";

interface ColumnWithTempId extends Omit<Column, "id"> {
  id: string;
  tempId?: string;
}

type ColumnState = {
  columns: Record<string, ColumnWithTempId>;
  tempToRealIdMap: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  previousState: Record<string, ColumnWithTempId> | null;
  setColumns: (columns: Column[]) => void;
  addColumn: (column: ColumnWithTempId) => void;
  updateColumn: (columnId: string, updates: Pick<Column, "status">) => void;
  deleteColumn: (columnId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  revertToPrevious: () => void;
  backupState: () => void;
  updateColumnId: (tempId: string, realId: string | undefined) => void;
};

export const useColumnStore = create<ColumnState>()(
  immer((set) => ({
    columns: {},
    tempToRealIdMap: {},
    isLoading: false,
    previousState: null,
    error: null,

    setColumns: (columns) => {
      set((state) => {
        state.columns = columns.reduce<Record<string, ColumnWithTempId>>(
          (acc, col) => {
            acc[col.id] = col;
            return acc;
          },
          {},
        );
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

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },
    setIsLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
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
          state.columns = state.previousState;
          state.previousState = null;
        }
      });
    },
  })),
);
