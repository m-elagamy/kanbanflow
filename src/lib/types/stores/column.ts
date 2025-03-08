import type { Column } from "@prisma/client";

export type ColumnView = Omit<Column, "order" | "boardId">;

type ColumnState = {
  columns: Record<string, ColumnView>;
  previousState: Record<string, ColumnView> | null;
};

type ColumnActions = {
  setColumns: (columns: ColumnView[]) => void;
  addColumn: (column: ColumnView) => void;

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
