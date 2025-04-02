export const withPerformanceMonitoring = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return | Promise<Return>,
  name: string,
) => {
  return async (...args: Args): Promise<Return> => {
    const start = performance.now();

    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      logPerformance(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logPerformance(name, duration, error);
      throw error;
    }
  };
};

function logPerformance(name: string, duration: number, error?: unknown) {
  const errorSuffix = error instanceof Error ? ` (${error.message})` : "";

  const getPerformanceInfo = () => {
    if (error) return { icon: "❌", label: "ERROR" };
    if (duration <= 16.67) return { icon: "⚡", label: "FAST" };
    if (duration <= 100) return { icon: "⚠️", label: "SLOW" };
    if (duration <= 500) return { icon: "🐢", label: "VERY SLOW" };
    return { icon: "🚨", label: "CRITICAL" };
  };

  const formatDuration = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const { icon, label } = getPerformanceInfo();

  const message = `${icon} [${label}] ${name} took ${formatDuration(duration)}${errorSuffix}`;

  if (error) {
    console.error(message);
  } else if (duration > 500) {
    console.error(message);
  } else if (duration > 100) {
    console.warn(message);
  } else if (duration > 16.67) {
    console.warn(message);
  } else {
    console.debug(message);
  }
}
