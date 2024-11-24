import generateUniqueID from "@/utils/generate-unique-ID";
import type { Board, BoardState } from "@/store/useBoardStore";

const addBoardToStore = (addBoard: BoardState["addBoard"], board: Board) => {
  addBoard({
    id: generateUniqueID(),
    title: board.title,
    description: board.description,
    columns: board.columns,
  });
};

export default addBoardToStore;
