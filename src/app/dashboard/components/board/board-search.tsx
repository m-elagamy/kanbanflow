"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function BoardSearch() {
  return (
    <div className="relative">
      <Search
        className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
        size={16}
      />
      <Input
        type="search"
        placeholder="Search"
        className="h-9 w-[200px] pl-9 md:w-[250px]"
        disabled
      />
    </div>
  );
}

