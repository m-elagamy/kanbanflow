import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    authInterrupts: true,
  },
};

export default nextConfig;
