"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { debounce } from "../../utils/debounce";

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const createPoints = useCallback(() => {
    const numPoints = window.innerWidth < 768 ? 50 : 100;
    return Array.from({ length: numPoints }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
  }, []);

  const points = useMemo(
    () => (isMounted ? createPoints() : []),
    [isMounted, createPoints],
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const maxDistance = 150;
    let lastTimestamp = 0;
    let animationFrameId: number;

    const drawFrame = (timestamp: number) => {
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach((point, i) => {
        point.x += point.vx * (deltaTime * 0.1);
        point.y += point.vy * (deltaTime * 0.1);

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        for (let j = i + 1; j < points.length; j++) {
          const otherPoint = points[j];
          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = ((maxDistance - distance) / maxDistance) * 0.2;
            const strokeColor =
              theme === "dark"
                ? `rgba(10, 132, 255, ${opacity})`
                : `rgba(37, 99, 235, ${opacity})`;

            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawFrame);
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [theme, points]);

  useEffect(() => {
    setIsMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const debouncedResize = debounce(resizeCanvas, 250);

    resizeCanvas();
    window.addEventListener("resize", debouncedResize);
    const cleanupAnimate = animate();

    return () => {
      window.removeEventListener("resize", debouncedResize);
      cleanupAnimate?.();
    };
  }, [animate]);

  return isMounted ? (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[-1]"
      aria-hidden="true"
    />
  ) : null;
}
