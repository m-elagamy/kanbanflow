import type { Board } from "@prisma/client";

type BoardStore = Omit<Board, "userId" | "order">;

type BoardState = {
  boards: Record<string, BoardStore>;
  activeBoardId: string | null;
};

type BoardActions = {
  setBoards: (
    boards:
      | Record<string, BoardStore>
      | ((prev: Record<string, BoardStore>) => Record<string, BoardStore>),
  ) => void;
  setActiveBoardId: (boardId: string | null) => void;
  createBoard: (board: BoardStore) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardId: (tempId: string, realId: string) => void;
};

type BoardStoreState = BoardState & BoardActions;

export type { BoardStoreState, BoardState, BoardActions, BoardStore };
