"use client";

import { ReactNode } from "react";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <GoogleOneTap
        signInForceRedirectUrl="/welcome"
        signUpForceRedirectUrl="/welcome"
      />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <MotionConfig reducedMotion="user">
          {children}
          <Toaster />
          <SpeedInsights />
        </MotionConfig>
      </ThemeProvider>
    </ClerkProvider>
  );
}
