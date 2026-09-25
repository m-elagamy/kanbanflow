"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

export default function HeaderScrollShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <header
      className={`sticky top-0 z-50 h-16 backdrop-blur-xs transition-colors ${isScrolled ? "bg-background/50 border-b" : ""}`}
    >
      {children}
    </header>
  );
}
