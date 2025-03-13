import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import isEqual from "fast-deep-equal";
import type { ColumnStore, SimplifiedColumn } from "@/lib/types/stores/column";

export const useColumnStore = create<ColumnStore>()(
  immer((set) => ({
    columnsByBoard: {},
    previousState: null,

    setColumns: (boardId, columns) => {
      console.log("setColumns", boardId, columns);
      set((state) => {
        const newColumns = columns.reduce<Record<string, SimplifiedColumn>>(
          (acc, col) => {
            acc[col.id] = col;
            return acc;
          },
          {},
        );

        if (isEqual(state.columnsByBoard[boardId], newColumns)) return state;

        return {
          columnsByBoard: { ...state.columnsByBoard, [boardId]: newColumns },
        };
      });
    },

    addColumn: (boardId, column) => {
      set((state) => {
        state.previousState = { ...state.columnsByBoard };
        if (!state.columnsByBoard[boardId]) {
          state.columnsByBoard[boardId] = {};
        }
        state.columnsByBoard[boardId][column.id] = column;
      });
    },

    updateColumn: (boardId, columnId, updates) => {
      set((state) => {
        if (!state.columnsByBoard[boardId]?.[columnId]) return state;
        state.previousState = { ...state.columnsByBoard };
        state.columnsByBoard[boardId][columnId] = {
          ...state.columnsByBoard[boardId][columnId],
          ...updates,
        };
      });
    },

    updateColumnId: (boardId, oldColumnId, newColumnId) => {
      set((state) => {
        if (!state.columnsByBoard[boardId]?.[oldColumnId]) return state;

        const updatedColumns = { ...state.columnsByBoard[boardId] };

        updatedColumns[newColumnId] = {
          ...updatedColumns[oldColumnId],
          id: newColumnId,
        };

        delete updatedColumns[oldColumnId];

        return {
          columnsByBoard: {
            ...state.columnsByBoard,
            [boardId]: updatedColumns,
          },
        };
      });
    },

    updatePredefinedColumnsId: (boardId, columns) => {
      set((state) => {
        if (!state.columnsByBoard[boardId]) return state;

        const updatedColumns = { ...state.columnsByBoard[boardId] };

        columns.forEach(({ oldId, newId }) => {
          if (updatedColumns[oldId]) {
            updatedColumns[newId] = {
              ...updatedColumns[oldId],
              id: newId,
            };
            delete updatedColumns[oldId];
          }
        });

        return {
          columnsByBoard: {
            ...state.columnsByBoard,
            [boardId]: updatedColumns,
          },
        };
      });
    },

    updateColumnsBoardId: (oldBoardId, newBoardId) => {
      set((state) => {
        if (!state.columnsByBoard[oldBoardId]) return state;

        return {
          columnsByBoard: {
            ...state.columnsByBoard,
            [newBoardId]: state.columnsByBoard[oldBoardId],
          },
        };
      });

      set((state) => {
        delete state.columnsByBoard[oldBoardId];
      });
    },

    deleteColumn: (boardId, columnId) => {
      set((state) => {
        if (!state.columnsByBoard[boardId]) return state;
        state.previousState = { ...state.columnsByBoard };
        delete state.columnsByBoard[boardId][columnId];
      });
    },

    backupState: () => {
      set((state) => {
        state.previousState = { ...state.columnsByBoard };
      });
    },

    revertToPrevious: () => {
      set((state) => {
        if (state.previousState) {
          state.columnsByBoard = { ...state.previousState };
          state.previousState = null;
        }
      });
    },
  })),
);
