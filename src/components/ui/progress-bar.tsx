"use client";

import { useEffect, useState } from "react";

type ProgressBarProps = {
  duration?: number;
  variant?: "success" | "error" | "warning" | "info";
};

const variantColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
};

const ProgressBar = ({
  duration = 4900,
  variant = "success",
}: ProgressBarProps) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(0);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-black/5">
      <div
        className={`h-full ${variantColors[variant]}`}
        style={{
          width: `${width}%`,
          transition: `width ${duration}ms linear`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
