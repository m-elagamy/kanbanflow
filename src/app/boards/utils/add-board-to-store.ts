import type { Board } from "@/lib/types/board";
import type { BoardState } from "@/lib/types/board-state";
import generateUniqueID from "@/utils/generate-unique-ID";

const addBoardToStore = (addBoard: BoardState["addBoard"], board: Board) => {
  addBoard({
    id: generateUniqueID(),
    title: board.title,
    description: board.description,
    columns: board.columns,
  });
};

export default addBoardToStore;
