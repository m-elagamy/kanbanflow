export const findColumnIdByTaskId = (
  columnTaskIds: Record<string, string[]>,
  taskId: string,
) => {
  return Object.keys(columnTaskIds).find((columnId) =>
    columnTaskIds[columnId].includes(taskId),
  );
};
