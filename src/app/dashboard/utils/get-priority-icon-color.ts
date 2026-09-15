const getPriorityIconColor = (priority: string) => {
  const classes = {
    high: "text-[var(--priority-high-icon)]",
    medium: "text-[var(--priority-medium-icon)]",
    low: "text-[var(--priority-low-icon)]",
  };
  return classes[priority as keyof typeof classes] || "text-muted-foreground";
};

export default getPriorityIconColor;
