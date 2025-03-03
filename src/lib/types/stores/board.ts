import type { Board } from "@prisma/client";

type BoardStore = Omit<Board, "userId" | "order">;

type LoadingStates = {
  fetchingBoards: boolean;
  creatingBoard: boolean;
  updatingBoard: Record<string, boolean>;
  deletingBoard: Record<string, boolean>;
};

type BoardState = {
  boards: Record<string, BoardStore>;
  activeBoardId: string | null;
  loadingStates: LoadingStates;
};

type BoardActions = {
  setBoards: (
    boards:
      | Record<string, BoardStore>
      | ((prev: Record<string, BoardStore>) => Record<string, BoardStore>),
  ) => void;
  setActiveBoardId: (boardId: string | null) => void;
  setFetchingBoards: (fetchingBoards: boolean) => void;
  setCreatingBoard: (creatingBoard: boolean) => void;
  setUpdatingBoard: (boardId: string, updatingBoard: boolean) => void;
  setDeletingBoard: (boardId: string, deletingBoard: boolean) => void;
  createBoard: (board: BoardStore) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardId: (tempId: string, realId: string) => void;
};

type BoardStoreState = BoardState & BoardActions;

export type {
  BoardStoreState,
  BoardState,
  BoardActions,
  LoadingStates,
  BoardStore,
};
