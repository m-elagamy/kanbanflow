"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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
    <main className="bg-muted/30 dark:bg-background relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8">
      <BackgroundEffect />
      <section className="relative z-10 w-full max-w-[440px]">
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
      </section>
    </main>
  );
}
