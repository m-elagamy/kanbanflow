import { create } from "zustand";
import { produce } from "immer";
import isEqual from "fast-deep-equal";
import type { Board } from "@prisma/client";

type BoardStore = Omit<Board, "userId" | "order">;

type BoardState = {
  boards: Record<string, BoardStore>;
  activeBoardId: string | null;

  loadingStates: {
    fetchingBoards: boolean;
    creatingBoard: boolean;
    updatingBoard: Record<string, boolean>;
    deletingBoard: Record<string, boolean>;
  };

  setFetchingBoards: (fetchingBoards: boolean) => void;
  setCreatingBoard: (creatingBoard: boolean) => void;
  setUpdatingBoard: (boardId: string, updatingBoard: boolean) => void;
  setDeletingBoard: (boardId: string, deletingBoard: boolean) => void;

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

const useBoardStore = create<BoardState>((set) => ({
  boards: {},
  activeBoardId: null,

  loadingStates: {
    fetchingBoards: true,
    creatingBoard: false,
    updatingBoard: {},
    deletingBoard: {},
  },

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

  /** ✅ Set fetching state */
  setFetchingBoards: (isLoading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, fetchingBoards: isLoading },
    })),

  /** ✅ Set creating state */
  setCreatingBoard: (isLoading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, creatingBoard: isLoading },
    })),

  /** ✅ Set updating state for a specific board */
  setUpdatingBoard: (boardId, isLoading) =>
    set(
      produce((state) => {
        state.loadingStates.updatingBoard[boardId] = isLoading;
      }),
    ),

  /** ✅ Set deleting state for a specific board */
  setDeletingBoard: (boardId, isLoading) =>
    set(
      produce((state) => {
        state.loadingStates.deletingBoard[boardId] = isLoading;
      }),
    ),

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
