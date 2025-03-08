import type { Board } from "@prisma/client";
import type { BoardFormValues } from "..";

export type SimplifiedBoard = Omit<Board, "userId" | "order">;

export type BoardState = {
  boards: Record<string, SimplifiedBoard>;
  activeBoardId: string | null;
  hasError: boolean;
  failedBoard: BoardFormValues | null;
};

type BoardActions = {
  setBoards: (
    boards:
      | Record<string, SimplifiedBoard>
      | ((
          prev: Record<string, SimplifiedBoard>,
        ) => Record<string, SimplifiedBoard>),
  ) => void;
  setActiveBoardId: (boardId: string | null) => void;
  setError: (hasError: boolean, failedBoard?: BoardFormValues) => void;

  createBoard: (board: SimplifiedBoard) => void;
  updateBoard: (boardId: string, updates: Partial<SimplifiedBoard>) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardId: (tempId: string, realId: string) => void;

  resetError: () => void;
};

export type BoardStore = BoardState & BoardActions;
