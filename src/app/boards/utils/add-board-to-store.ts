import type { Board } from "@/lib/types/board";
import type { KanbanState } from "@/lib/types/kanban-state";
import generateUniqueID from "@/utils/generate-unique-ID";

const addBoardToStore = (addBoard: KanbanState["addBoard"], board: Board) => {
  addBoard({
    id: generateUniqueID(),
    title: board.title,
    description: board.description,
    columns: board.columns,
  });
};

export default addBoardToStore;
