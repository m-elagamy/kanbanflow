const getBadgeStyle = (priority: string) => {
  const classes = {
    high: "bg-gradient-to-r border border-orange-200/50 from-orange-100/90 to-orange-200/90 text-orange-900 dark:border-orange-700/30 dark:from-orange-600/35 dark:to-orange-700/35 dark:text-orange-100",
    medium:
      "bg-gradient-to-r border border-purple-200/50 from-purple-100/90 to-purple-200/90 text-purple-900 dark:border-purple-700/30 dark:from-purple-600/35 dark:to-purple-700/35 dark:text-purple-100",
    low: "bg-gradient-to-r border border-blue-200/50 from-blue-100/90 to-blue-200/90 text-blue-900 dark:border-blue-700/30 dark:from-blue-600/35 dark:to-blue-700/35 dark:text-blue-100",
  };
  return (
    classes[priority as keyof typeof classes] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  );
};

export default getBadgeStyle;
