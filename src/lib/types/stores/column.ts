import type { Column } from "@prisma/client";

export type SimplifiedColumn = Omit<Column, "boardId">;

export type ColumnSnapshot = {
  boardId: string;
  columnId: string;
  previousData: SimplifiedColumn | null;
} | null;

export type ColumnReorderSnapshot = {
  boardId: string;
  previousColumns: Record<string, SimplifiedColumn>;
} | null;

export type ColumnState = {
  columnsByBoard: Record<string, Record<string, SimplifiedColumn>>;
  previousState: ColumnSnapshot;
  previousReorderState: ColumnReorderSnapshot;
};

export type ColumnActions = {
  setColumns: (
    boardId: string,
    columns: ReadonlyArray<SimplifiedColumn>,
  ) => void;

  addColumn: (boardId: string, column: SimplifiedColumn) => void;
  updateColumn: (
    boardId: string,
    columnId: string,
    updates: Pick<Column, "status">,
  ) => void;
  deleteColumn: (boardId: string, columnId: string) => void;

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
  ) => void;
  rollbackReorder: () => void;

  rollback: () => void;
};

export type ColumnStore = ColumnState & ColumnActions;
