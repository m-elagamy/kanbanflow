import { create } from "zustand";
import { produce } from "immer";
import isEqual from "fast-deep-equal";
import type { Board } from "@prisma/client";

type BoardStore = Omit<Board, "userId" | "order">;

type BoardState = {
  boards: Record<string, BoardStore>;
  activeBoardId: string | null;
  isDeleting: boolean;
  isLoading: boolean;

  setBoards: (
    boards:
      | Record<string, BoardStore>
      | ((prev: Record<string, BoardStore>) => Record<string, BoardStore>),
  ) => void;
  setActiveBoardId: (boardId: string | null) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;

  createBoard: (board: BoardStore) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardId: (tempId: string, realId: string) => void;
};

const useBoardStore = create<BoardState>((set) => ({
  boards: {},
  activeBoardId: null,
  isDeleting: false,
  isLoading: true,

  /** ✅ Set all boards at once */
  setBoards: (boards) => {
    set((state) => {
      const updatedBoards = {
        ...state.boards,
        ...(typeof boards === "function" ? boards(state.boards) : boards),
      };

      if (isEqual(state.boards, updatedBoards)) return state;

      return { boards: updatedBoards };
    });
  },

  /** ✅ Set active board */
  setActiveBoardId: (boardId) => set({ activeBoardId: boardId }),

  /** ✅ Set isDeleting */
  setIsDeleting: (isDeleting) => set({ isDeleting }),

  /** ✅ Set isLoading */
  setIsLoading: (isLoading) => set({ isLoading }),

  /** ✅ Create a new board */
  createBoard: (board) => {
    set(
      produce((state: BoardState) => {
        state.boards[board.id] = board;
        state.activeBoardId = board.id;
      }),
    );
  },

  /** ✅ Update an existing board */
  updateBoard: (boardId, updates) => {
    set(
      produce((state: BoardState) => {
        if (state.boards[boardId]) {
          Object.assign(state.boards[boardId], updates);
        }
      }),
    );
  },

  /** ✅ Delete a board */
  deleteBoard: (boardId) => {
    set(
      produce((state: BoardState) => {
        delete state.boards[boardId];
        if (state.activeBoardId === boardId) {
          state.activeBoardId = null;
        }
      }),
    );
  },

  /** ✅ Update board ID after creation */
  updateBoardId: (tempId, realId) => {
    set(
      produce((state: BoardState) => {
        if (state.boards[tempId]) {
          state.boards[realId] = { ...state.boards[tempId], id: realId };
          delete state.boards[tempId];

          if (state.activeBoardId === tempId) {
            state.activeBoardId = realId;
          }
        }
      }),
    );
  },
}));

export default useBoardStore;
