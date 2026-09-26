import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import isEqual from "fast-deep-equal";
import type { ColumnStore, SimplifiedColumn } from "@/lib/types/stores/column";

const createOperationId = () => crypto.randomUUID();

export const useColumnStore = create<ColumnStore>()(
  immer((set) => ({
    activeBoardId: null,
    columnsByBoard: {},
    optimisticOperations: {},

    initializeColumns: (boardId, columns) => {
      set((state) => {
        const newColumns = columns.reduce<Record<string, SimplifiedColumn>>(
          (acc, col) => {
            acc[col.id] = col;
            return acc;
          },
          {},
        );

        state.activeBoardId = boardId;
        state.columnsByBoard = { [boardId]: newColumns };
        state.optimisticOperations = {};
      });
    },

    setColumns: (boardId, columns) => {
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
      const operationId = createOperationId();
      set((state) => {
        if (state.activeBoardId !== boardId) return state;
        if (!state.columnsByBoard[boardId]) state.columnsByBoard[boardId] = {};
        state.optimisticOperations[operationId] = {
          kind: "add",
          boardId,
          columnId: column.id,
          previousData: null,
          optimisticData: column,
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
      return operationId;
    },

    updateColumn: (boardId, columnId, updates) => {
      const operationId = createOperationId();
      set((state) => {
        if (state.activeBoardId !== boardId) return state;
        if (!state.columnsByBoard[boardId]?.[columnId]) return state;

        const columnToUpdate = state.columnsByBoard[boardId][columnId];
        state.optimisticOperations[operationId] = {
          kind: "update",
          boardId,
          columnId,
          previousData: {
            id: columnToUpdate.id,
            status: columnToUpdate.status,
            order: columnToUpdate.order,
          },
          optimisticData: { ...columnToUpdate, ...updates },
        };

        state.columnsByBoard[boardId][columnId] = {
          ...columnToUpdate,
          ...updates,
        };
      });
      return operationId;
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

    reorderColumns: (boardId, activeColumnId, overColumnId) => {
      const operationId = createOperationId();
      set((state) => {
        if (state.activeBoardId !== boardId) return state;
        const columns = state.columnsByBoard[boardId];
        if (!columns) return state;

        const sorted = Object.values(columns).sort((a, b) => a.order - b.order);
        const activeIndex = sorted.findIndex((c) => c.id === activeColumnId);
        const overIndex = sorted.findIndex((c) => c.id === overColumnId);

        if (activeIndex === -1 || overIndex === -1) return state;

        const previousOrders = Object.fromEntries(
          sorted.map((column) => [column.id, column.order]),
        );

        const [moved] = sorted.splice(activeIndex, 1);
        sorted.splice(overIndex, 0, moved);

        sorted.forEach((column, index) => {
          state.columnsByBoard[boardId][column.id] = {
            ...column,
            order: index,
          };
        });
        state.optimisticOperations[operationId] = {
          kind: "reorder",
          boardId,
          previousOrders,
          optimisticOrders: Object.fromEntries(
            sorted.map((column, index) => [column.id, index]),
          ),
        };
      });
      return operationId;
    },

    rollbackReorder: (operationId) => {
      set((state) => {
        const id = operationId ?? Object.keys(state.optimisticOperations).at(-1);
        if (!id) return state;
        const operation = state.optimisticOperations[id];
        if (!operation || operation.kind !== "reorder") return state;
        if (state.activeBoardId === operation.boardId) {
          const columns = state.columnsByBoard[operation.boardId] ?? {};
          for (const [columnId, previousOrder] of Object.entries(operation.previousOrders)) {
            const column = columns[columnId];
            if (column && column.order === operation.optimisticOrders[columnId]) {
              column.order = previousOrder;
            }
          }
        }
        delete state.optimisticOperations[id];
      });
    },

    clearOperation: (operationId) => {
      set((state) => {
        if (operationId) delete state.optimisticOperations[operationId];
        else state.optimisticOperations = {};
      });
    },

    deleteColumn: (boardId, columnId) => {
      const operationId = createOperationId();
      set((state) => {
        if (state.activeBoardId !== boardId) return;
        if (!state.columnsByBoard[boardId]) return;

        const columnToDelete = state.columnsByBoard[boardId][columnId];
        if (!columnToDelete) return;
        state.optimisticOperations[operationId] = {
          kind: "delete",
          boardId,
          columnId,
          previousData: columnToDelete,
          optimisticData: null,
        };

        delete state.columnsByBoard[boardId][columnId];
      });
      return operationId;
    },

    rollback: (operationId) => {
      set((state) => {
        const id = operationId ?? Object.keys(state.optimisticOperations).at(-1);
        if (!id) return state;
        const operation = state.optimisticOperations[id];
        if (!operation || operation.kind === "reorder") return state;
        if (state.activeBoardId === operation.boardId) {
          const board = state.columnsByBoard[operation.boardId] ?? {};
          const current = board[operation.columnId];
          if (operation.previousData === null) {
            if (current && operation.optimisticData?.id === current.id) {
              delete board[operation.columnId];
            }
          } else if (!current ||
            !operation.optimisticData ||
            current.status === operation.optimisticData.status) {
            board[operation.columnId] = operation.previousData;
          }
        }
        delete state.optimisticOperations[id];
      });
    },
  })),
);
