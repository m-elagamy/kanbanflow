import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarGroupLabel } from "@/components/ui/sidebar";

const SidebarLabel = ({ boardsCount }: { boardsCount?: number }) => {
  return (
    <SidebarGroupLabel
      className={`${boardsCount ? "flex-row justify-between pr-0" : "flex-col justify-center gap-2 pt-4"} uppercase`}
    >
      {boardsCount ? (
        <>
          Boards
          <Badge
            variant="outline"
            className="h-5 rounded-md px-[7px] text-[0.690rem]"
          >
            {boardsCount}
          </Badge>
        </>
      ) : (
        <>
          <Inbox />
          Your list is empty
        </>
      )}
    </SidebarGroupLabel>
  );
};

export default SidebarLabel;
