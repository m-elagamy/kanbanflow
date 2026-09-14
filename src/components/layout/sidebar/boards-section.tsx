import { SidebarGroupContent } from "@/components/ui/sidebar";
import { getAllUserBoardsAction } from "@/actions/user";
import SidebarLabel from "./sidebar-label";
import { BoardsList } from "./boards-list";

export default async function BoardsSection() {
  const result = (await getAllUserBoardsAction()).fields;

  return (
    <>
      <SidebarLabel boardsCount={result?.totalCount} />
      <SidebarGroupContent>
        {result && (
          <BoardsList boards={result.boards} totalCount={result.totalCount} />
        )}
      </SidebarGroupContent>
    </>
  );
}
