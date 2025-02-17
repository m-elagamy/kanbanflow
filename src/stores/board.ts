import { create } from "zustand";
import type { Board } from "@prisma/client";

type BoardState = {
  boards: Omit<Board, "userId">[];
  loading: boolean;
  error: string | null;

  setBoards: (boards: Omit<Board, "userId">[]) => void;

  addBoard: (board: Board) => void;
  updateBoard: (updatedBoard: Pick<Board, "id" | "description">) => void;
  removeBoard: (boardId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  loading: false,
  error: null,

  setBoards: (boards) => set({ boards }),

  addBoard: (board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),

  updateBoard: (updatedBoard) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === updatedBoard.id
          ? { ...board, description: updatedBoard.description }
          : board,
      ),
    })),

  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useBoardStore;
