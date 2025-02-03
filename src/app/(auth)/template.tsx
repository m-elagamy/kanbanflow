"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion-variants";
import BackgroundEffect from "./components/background-effect";
import { Button } from "@/components/ui/button";

const LegalDocumentModal = dynamic(
  () =>
    import("./components/legal-document").then((mod) => mod.LegalDocumentModal),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLegalDocument, setShowLegalDocument] = useState(false);

  const handleShowingLegalDocument = () => {
    setShowLegalDocument(true);
  };

  return (
    <main className="relative grid min-h-dvh items-center overflow-hidden px-4 sm:justify-center">
      <BackgroundEffect />
      <motion.section variants={fadeIn} initial="initial" animate="animate">
        {children}
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            By signing in, you agree to our
          </span>
          <Button
            variant="link"
            className="px-1 pr-0"
            onClick={handleShowingLegalDocument}
          >
            Terms of Service
          </Button>
          {showLegalDocument && (
            <LegalDocumentModal
              isOpen={showLegalDocument}
              setIsOpen={setShowLegalDocument}
            />
          )}
          .
        </div>
      </motion.section>
    </main>
  );
}
