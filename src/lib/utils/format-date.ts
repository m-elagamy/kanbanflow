const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCreatedDate(value: Date | string) {
  return `Created ${formatDate(value)}`;
}

export function formatDate(value: Date | string) {
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}
