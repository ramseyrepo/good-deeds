/** Turn a display name / email into a URL-safe base slug. */
export function baseSlug(input: string | null | undefined): string {
  const raw = (input ?? "").toLowerCase().trim();
  const slug = raw
    .replace(/@.*$/, "") // drop email domain
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return slug || "volunteer";
}

/** Short random suffix to keep usernames unique. */
export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

export const USERNAME_RE = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$/;
