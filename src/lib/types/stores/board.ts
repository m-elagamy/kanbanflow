import type { Board } from "@prisma/client";
import type { BoardFormValues } from "..";

export type BoardView = Omit<Board, "userId" | "order">;

export type BoardState = {
  boards: Record<string, BoardView>;
  activeBoardId: string | null;
  hasError: boolean;
  failedBoard: BoardFormValues | null;
};

type BoardActions = {
  setBoards: (
    boards:
      | Record<string, BoardView>
      | ((prev: Record<string, BoardView>) => Record<string, BoardView>),
  ) => void;
  setActiveBoardId: (boardId: string | null) => void;
  setError: (hasError: boolean, failedBoard?: BoardFormValues) => void;

  createBoard: (board: BoardView) => void;
  updateBoard: (boardId: string, updates: Partial<BoardView>) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardId: (tempId: string, realId: string) => void;

  resetError: () => void;
};

export type BoardStore = BoardState & BoardActions;
