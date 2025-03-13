import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    authInterrupts: true,
    staleTimes: {
      dynamic: 10,
      static: 60,
    },
  },
};

export default nextConfig;
