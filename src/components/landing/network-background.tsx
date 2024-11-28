"use client";

import { useEffect, useRef, useCallback } from "react";
import { debounce } from "../../utils/debounce";
import { useTheme } from "next-themes";

export function NetworkBackground() {
  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points: { x: number; y: number; vx: number; vy: number }[] = [];
    const numPoints = window.innerWidth < 768 ? 50 : 100;
    const maxDistance = 150;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numPoints; i++) {
        const point = points[i];
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        for (let j = i + 1; j < numPoints; j++) {
          const otherPoint = points[j];
          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = `${theme !== "dark" ? "rgba(59, 130, 246," : "rgba(0, 47, 167,"} ${
              ((maxDistance - distance) / maxDistance) * 0.2
            })`;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
          }
        }
      }

      // Limit frame rate on mobile
      const fps = window.innerWidth < 768 ? 30 : 60;
      setTimeout(() => requestAnimationFrame(drawFrame), 1000 / fps);
    };

    drawFrame();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const debouncedResize = debounce(resizeCanvas, 250);

    resizeCanvas();
    window.addEventListener("resize", debouncedResize);

    animate();

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[-1]"
      aria-hidden="true"
    />
  );
}
