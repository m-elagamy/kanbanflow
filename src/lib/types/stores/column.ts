import type { Column } from "@prisma/client";

export type SimplifiedColumn = Omit<Column, "boardId">;

export type ColumnOperation =
  | {
      kind: "add" | "delete" | "update";
      boardId: string;
      columnId: string;
      previousData: SimplifiedColumn | null;
      optimisticData: SimplifiedColumn | null;
    }
  | {
      kind: "reorder";
      boardId: string;
      previousOrders: Record<string, number>;
      optimisticOrders: Record<string, number>;
    };

export type ColumnState = {
  activeBoardId: string | null;
  columnsByBoard: Record<string, Record<string, SimplifiedColumn>>;
  optimisticOperations: Record<string, ColumnOperation>;
};

export type ColumnActions = {
  initializeColumns: (
    boardId: string,
    columns: ReadonlyArray<SimplifiedColumn>,
  ) => void;
  setColumns: (
    boardId: string,
    columns: ReadonlyArray<SimplifiedColumn>,
  ) => void;

  addColumn: (boardId: string, column: SimplifiedColumn) => string | null;
  updateColumn: (
    boardId: string,
    columnId: string,
    updates: Pick<Column, "status">,
  ) => string | null;
  deleteColumn: (boardId: string, columnId: string) => string | null;

  updateColumnId: (
    boardId: string,
    oldColumnId: string,
    newColumnId: string,
  ) => void;
  updatePredefinedColumnsId: (
    boardId: string,
    columns: ReadonlyArray<{ oldId: string; newId: string }>,
  ) => void;
  transferColumnsToBoard: (oldBoardId: string, newBoardId: string) => void;

  reorderColumns: (
    boardId: string,
    activeColumnId: string,
    overColumnId: string,
  ) => string | null;
  rollbackReorder: (operationId?: string) => void;
  clearOperation: (operationId?: string) => void;

  rollback: (operationId?: string) => void;
};

export type ColumnStore = ColumnState & ColumnActions;
