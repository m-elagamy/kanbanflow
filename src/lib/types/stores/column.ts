import type { Column } from "@prisma/client";

export type SimplifiedColumn = Omit<Column, "order" | "boardId">;

type ColumnState = {
  columnsByBoard: Record<string, Record<string, SimplifiedColumn>>;
  previousState: Record<string, Record<string, SimplifiedColumn>> | null;
};

type ColumnActions = {
  setColumns: (boardId: string, columns: SimplifiedColumn[]) => void;
  addColumn: (boardId: string, column: SimplifiedColumn) => void;
  updateColumn: (
    boardId: string,
    columnId: string,
    updates: Pick<Column, "status">,
  ) => void;
  updateColumnId: (
    boardId: string,
    oldColumnId: string,
    newColumnId: string,
  ) => void;
  updatePredefinedColumnsId: (
    boardId: string,
    columns: { oldId: string; newId: string }[],
  ) => void;
  updateColumnsBoardId: (oldBoardId: string, newBoardId: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
};

type ColumnHelpers = {
  revertToPrevious: () => void;
  backupState: () => void;
};

export type ColumnStore = ColumnState & ColumnActions & ColumnHelpers;
