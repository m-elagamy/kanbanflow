export const findColumnIdByTaskId = (
  columnTaskIds: Record<string, string[]>,
  taskId: string,
) => {
  return Object.keys(columnTaskIds).find((columnId) =>
    columnTaskIds[columnId].includes(taskId),
  );
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTaskAgeDays(columnEnteredAt: string, now = Date.now()) {
  const enteredAt = new Date(columnEnteredAt).getTime();
  if (Number.isNaN(enteredAt)) return null;
  return Math.max(0, Math.floor((now - enteredAt) / DAY_IN_MS));
}
