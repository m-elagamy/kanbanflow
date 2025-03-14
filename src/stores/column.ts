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
        if (!state.columnsByBoard[boardId]) state.columnsByBoard[boardId] = {};

        state.previousState = {
          boardId,
          columnId: column.id,
          previousData: null,
        };

        const columns = Object.values(state.columnsByBoard[boardId]);
        const maxOrder =
          columns.length > 0
            ? Math.max(...columns.map((col) => col.order))
            : -1;

        state.columnsByBoard[boardId][column.id] = {
          ...column,
          order: maxOrder + 1,
        };
      });
    },

    updateColumn: (boardId, columnId, updates) => {
      set((state) => {
        if (!state.columnsByBoard[boardId]?.[columnId]) return state;

        const columnToUpdate = state.columnsByBoard[boardId][columnId];
        state.previousState = {
          boardId,
          columnId,
          previousData: {
            id: columnToUpdate.id,
            status: columnToUpdate.status,
            order: columnToUpdate.order,
          },
        };

        state.columnsByBoard[boardId][columnId] = {
          ...columnToUpdate,
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

    transferColumnsToBoard: (oldBoardId, newBoardId) => {
      set((state) => {
        if (!state.columnsByBoard[oldBoardId]) return state;

        const updatedColumnsByBoard = { ...state.columnsByBoard };

        updatedColumnsByBoard[newBoardId] = state.columnsByBoard[oldBoardId];

        delete updatedColumnsByBoard[oldBoardId];

        return {
          columnsByBoard: updatedColumnsByBoard,
        };
      });
    },

    deleteColumn: (boardId, columnId) => {
      set((state) => {
        if (!state.columnsByBoard[boardId]) return;

        const columnToDelete = state.columnsByBoard[boardId][columnId];
        state.previousState = {
          boardId,
          columnId,
          previousData: columnToDelete,
        };

        delete state.columnsByBoard[boardId][columnId];
      });
    },

    rollback: () => {
      set((state) => {
        if (!state.previousState) return state;

        const { boardId, columnId, previousData } = state.previousState;

        const updatedColumnsByBoard = { ...state.columnsByBoard };
        const updatedBoard = { ...updatedColumnsByBoard[boardId] };
        updatedColumnsByBoard[boardId] = updatedBoard;

        if (!previousData) {
          delete updatedBoard[columnId];
        } else {
          updatedBoard[columnId] = previousData;
        }

        return {
          ...state,
          columnsByBoard: updatedColumnsByBoard,
          previousState: null,
        };
      });
    },
  })),
);
