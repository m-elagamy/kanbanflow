"use client";

import dynamic from "next/dynamic";

const FloatingParticles = dynamic(() => import("./floating-particles"), {
  ssr: false,
  loading: () => <div className="absolute size-7" />,
});

export default function FloatingParticlesWrapper() {
  return <FloatingParticles />;
}
