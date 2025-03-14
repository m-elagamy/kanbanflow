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
  const getStatus = () => {
    if (error) return "❌";
    if (duration > 16.67) return "⚠️";
    return "✓";
  };

  const status = getStatus();
  const errorSuffix = error instanceof Error ? ` (${error.message})` : "";

  if (duration > 16.67) {
    console.warn(
      `${status} Slow operation: ${name} took ${duration.toFixed(2)}ms${errorSuffix}`,
    );
  } else {
    console.debug(`${status} ${name}: ${duration.toFixed(2)}ms${errorSuffix}`);
  }
}
