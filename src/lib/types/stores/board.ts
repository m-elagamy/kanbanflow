import type { Board } from "@prisma/client";
import type { BoardFormValues } from "..";

type BoardStore = Omit<Board, "userId" | "order">;

type BoardState = {
  boards: Record<string, BoardStore>;
  activeBoardId: string | null;
  hasError: boolean;
  failedBoard: BoardFormValues | null;
};

type BoardActions = {
  setBoards: (
    boards:
      | Record<string, BoardStore>
      | ((prev: Record<string, BoardStore>) => Record<string, BoardStore>),
  ) => void;
  setActiveBoardId: (boardId: string | null) => void;
  setError: (hasError: boolean, failedBoard?: BoardFormValues) => void;
  createBoard: (board: BoardStore) => void;
  updateBoard: (boardId: string, updates: Partial<BoardStore>) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardId: (tempId: string, realId: string) => void;
  resetError: () => void;
};

type BoardStoreState = BoardState & BoardActions;

export type { BoardStoreState, BoardState, BoardActions, BoardStore };
