import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import isEqual from "fast-deep-equal";
import type { ColumnStore, ColumnView } from "@/lib/types/stores/column";

export const useColumnStore = create<ColumnStore>()(
  immer((set) => ({
    columns: {},
    previousState: null,

    setColumns: (columns) => {
      set((state) => {
        const newColumns = columns.reduce<Record<string, ColumnView>>(
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
        state.columns[column.id] = column;
      });
    },

    updateColumn: (columnId, updates) => {
      set((state) => {
        state.previousState = { ...state.columns };
        state.columns[columnId] = { ...state.columns[columnId], ...updates };
      });
    },

    updateColumnId: (oldColumnId, newColumnId) => {
      set((state) => {
        if (!state.columns[oldColumnId]) return state;

        const updatedColumns = { ...state.columns };

        updatedColumns[newColumnId] = {
          ...updatedColumns[oldColumnId],
          id: newColumnId,
        };

        delete updatedColumns[oldColumnId];

        return { columns: updatedColumns };
      });
    },

    updatePredefinedColumnsId: (columns) => {
      set((state) => {
        const updatedColumns = { ...state.columns };

        columns.forEach(({ oldId, newId }) => {
          if (updatedColumns[oldId]) {
            updatedColumns[newId] = {
              ...updatedColumns[oldId],
              id: newId,
            };
            delete updatedColumns[oldId];
          }
        });

        return { columns: updatedColumns };
      });
    },

    deleteColumn: (columnId) => {
      set((state) => {
        state.previousState = { ...state.columns };
        delete state.columns[columnId];
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
