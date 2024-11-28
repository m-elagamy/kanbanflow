"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

function SignInButton() {
  return (
    <div>
      <Button
        variant="outline"
        className="group relative overflow-hidden transition-colors duration-300 hover:bg-accent/25"
        asChild
      >
        <Link href="/boards" className="flex items-center gap-2">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/5"
            animate={{
              x: ["-100%", "100%"],
              transition: {
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              },
            }}
          />
          <LogIn className="transition-transform group-hover:translate-x-1" />
          <span className="relative z-10">Sign In</span>
        </Link>
      </Button>
    </div>
  );
}

export default SignInButton;
