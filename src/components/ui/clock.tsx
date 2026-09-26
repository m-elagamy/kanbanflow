"use client";
import { useSyncExternalStore } from "react";
import { SlidingNumber } from "./sliding-number";

function subscribe(callback: () => void, showSeconds: boolean) {
  const interval = setInterval(callback, showSeconds ? 1000 : 60_000);
  return () => clearInterval(interval);
}

function getSnapshot(showSeconds: boolean) {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes();
  const time = `${hours}:${minutes}`;
  return showSeconds ? `${time}:${now.getSeconds()}` : time;
}

function getServerSnapshot() {
  return null;
}

export function Clock({ showSeconds = true }: { showSeconds?: boolean }) {
  const snapshot = useSyncExternalStore(
    (callback) => subscribe(callback, showSeconds),
    () => getSnapshot(showSeconds),
    getServerSnapshot,
  );

  if (!snapshot) {
    return (
      <span className="invisible font-mono text-muted-foreground/40" aria-hidden="true">
        {showSeconds ? "00:00:00" : "00:00"}
      </span>
    );
  }

  const [hours, minutes, seconds] = snapshot.split(":").map(Number);

  return (
    <div className="flex items-center gap-0.5 font-mono">
      <SlidingNumber value={hours} padStart={true} />
      <span className="text-muted-foreground/60">:</span>
      <SlidingNumber value={minutes} padStart={true} />
      {showSeconds && (
        <>
          <span className="text-muted-foreground/60">:</span>
          <SlidingNumber value={seconds} padStart={true} />
        </>
      )}
    </div>
  );
}
