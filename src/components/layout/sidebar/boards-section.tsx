import { SidebarGroupContent } from "@/components/ui/sidebar";
import { getAllUserBoardsAction } from "@/actions/user";
import SidebarLabel from "./sidebar-label";
import { BoardsList } from "./boards-list";

export default async function BoardsSection() {
  const userBoards = (await getAllUserBoardsAction()).fields;

  return (
    <>
      <SidebarLabel boardsCount={userBoards?.length} />
      <SidebarGroupContent>
        {userBoards && <BoardsList boards={userBoards} />}
      </SidebarGroupContent>
    </>
  );
}
