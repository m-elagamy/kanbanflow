async function ensureUniqueSlug(
  slug: string,
  existingSlugs: string[],
): Promise<string> {
  let uniqueSlug = slug;
  let identifier = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${identifier}`;
    identifier++;
  }

  return uniqueSlug;
}

export default ensureUniqueSlug;
