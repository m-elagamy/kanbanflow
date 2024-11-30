import generateUniqueID from "@/utils/generate-unique-ID";
import type { Board, BoardState } from "@/stores/use-board-store";

const addBoardToStore = (addBoard: BoardState["addBoard"], board: Board) => {
  addBoard({
    id: generateUniqueID(),
    title: board.title,
    description: board.description,
    columns: board.columns,
  });
};

export default addBoardToStore;
