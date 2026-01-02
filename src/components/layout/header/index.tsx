"use client";

import { useState } from "react";

import UserAvatar from "./user-avatar";
import KanbanLogo from "./kanban-logo";
import SignInButton from "./sign-in-btn";
import { useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathName === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <header
      className={`sticky top-0 z-50 h-16 backdrop-blur-xs transition-colors ${isScrolled ? "border-b bg-background/50" : ""}`}
    >
      <div className="container flex h-full items-center justify-between">
        <KanbanLogo />

        <div className="flex items-center gap-4">
          {isHomePage ? <SignInButton /> : <UserAvatar />}
        </div>
      </div>
      {!isHomePage && (
        <div className="h-[1px] w-full bg-linear-to-r from-transparent via-[#3F8DA0]/50 to-transparent opacity-50 dark:via-[#4f637399]" />
      )}
    </header>
  );
};

export default Header;
