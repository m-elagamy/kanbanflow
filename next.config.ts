import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    authInterrupts: true,
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
