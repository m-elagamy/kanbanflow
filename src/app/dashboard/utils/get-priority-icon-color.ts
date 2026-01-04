const getPriorityIconColor = (priority: string) => {
  const classes = {
    high: "text-orange-600 dark:text-orange-400",
    medium: "text-purple-600 dark:text-purple-400",
    low: "text-blue-600 dark:text-blue-400",
  };
  return (
    classes[priority as keyof typeof classes] ||
    "text-muted-foreground"
  );
};

export default getPriorityIconColor;

