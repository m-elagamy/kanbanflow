"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
    loading: () => null,
  },
);

const DndProvider = ({ children }: { children: ReactNode }) => {
  return <DndContext>{children}</DndContext>;
};

export default DndProvider;
