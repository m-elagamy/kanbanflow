import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    staleTimes: {
      dynamic: 60,
    },
  },
};

export default nextConfig;
