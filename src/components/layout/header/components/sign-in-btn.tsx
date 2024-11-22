"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

function SignInButton() {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <Button
        variant="outline"
        className="border px-2 hover:bg-accent/30 md:px-4"
        asChild
      >
        <Link href="/login" className="group flex items-center gap-2">
          <LogIn className="transition-transform group-hover:translate-x-1" />
          Sign In
        </Link>
      </Button>
    </motion.div>
  );
}

export default SignInButton;
