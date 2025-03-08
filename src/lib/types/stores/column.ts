import type { Column } from "@prisma/client";

export type SimplifiedColumn = Omit<Column, "order" | "boardId">;

type ColumnState = {
  columns: Record<string, SimplifiedColumn>;
  previousState: Record<string, SimplifiedColumn> | null;
};

type ColumnActions = {
  setColumns: (columns: SimplifiedColumn[]) => void;
  addColumn: (column: SimplifiedColumn) => void;

  updateColumn: (columnId: string, updates: Pick<Column, "status">) => void;
  updateColumnId: (oldColumnId: string, newColumnId: string) => void;
  updatePredefinedColumnsId: (
    columns: { oldId: string; newId: string }[],
  ) => void;
  deleteColumn: (columnId: string) => void;
};

type ColumnHelpers = {
  revertToPrevious: () => void;
  backupState: () => void;
};

export type ColumnStore = ColumnState & ColumnActions & ColumnHelpers;
