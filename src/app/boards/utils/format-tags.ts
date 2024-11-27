export const formatTags = (tags: string | undefined): string[] => {
  if (!tags) return [];

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
};
