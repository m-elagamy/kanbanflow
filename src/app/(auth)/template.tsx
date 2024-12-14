"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion-variants";
import BackgroundEffect from "./components/background-effect";
import { LegalDocumentModal } from "./components/legal-document";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-dvh items-center overflow-hidden px-4 sm:justify-center">
      <BackgroundEffect />
      <motion.section variants={fadeIn} initial="initial" animate="animate">
        {children}
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            By signing in, you agree to our
          </span>
          <LegalDocumentModal />.
        </div>
      </motion.section>
    </main>
  );
}
