"use client";
import { useSyncExternalStore } from "react";
import { SlidingNumber } from "./sliding-number";

function subscribe(callback: () => void) {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}

function getSnapshot() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

function getServerSnapshot() {
  return null;
}

export function Clock() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!snapshot) {
    return <span className="font-mono text-muted-foreground/40">00:00:00</span>;
  }

  const [hours, minutes, seconds] = snapshot.split(":").map(Number);

  return (
    <div className="flex items-center gap-0.5 font-mono">
      <SlidingNumber value={hours} padStart={true} />
      <span className="text-muted-foreground/60">:</span>
      <SlidingNumber value={minutes} padStart={true} />
      <span className="text-muted-foreground/60">:</span>
      <SlidingNumber value={seconds} padStart={true} />
    </div>
  );
}
