const deslugify = (slug: string): string =>
  slug
    .replace(/-/g, " ")
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    .trim();

export default deslugify;
