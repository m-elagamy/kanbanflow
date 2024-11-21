export const formatTags = (tags: string | undefined): string[] => {
  return tags ? tags.split(",").map((tag) => tag.trim()) : [];
};
