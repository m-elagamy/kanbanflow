const prefillTags = (tags: string[] | undefined) => {
  if (Array.isArray(tags)) return tags.join(", ");
  return tags;
};

export default prefillTags;
