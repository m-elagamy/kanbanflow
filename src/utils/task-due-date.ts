// Due dates are calendar dates, stored as YYYY-MM-DD or midnight UTC.
export function getTaskDueDate(dateString: string, now: Date) {
  const day = dateString.slice(0, 10);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const date = new Date(`${day}T00:00:00Z`);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return {
    day,
    overdue: day < today,
    label:
      day < today
        ? `Overdue · ${formatted}`
        : day === today
          ? "Today"
          : formatted,
  };
}
