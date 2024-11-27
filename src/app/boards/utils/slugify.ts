export function slugifyTitle(title: string): string {
  return title.toLowerCase().trim().replace(/\s+/g, "-");
}
