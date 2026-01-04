"use client";

type TaskProgressProps = {
  progress: number; // 0-100
  className?: string;
};

export function TaskProgress({ progress, className = "" }: TaskProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Determine color based on progress
  const getProgressColor = () => {
    if (clampedProgress >= 100) return "bg-green-500";
    if (clampedProgress >= 75) return "bg-blue-500";
    if (clampedProgress >= 50) return "bg-primary";
    if (clampedProgress >= 25) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-muted/50 h-2 w-full overflow-hidden rounded-full">
        <div
          className={`h-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

