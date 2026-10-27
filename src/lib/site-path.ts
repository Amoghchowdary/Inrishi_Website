const GITHUB_REPOSITORY = "Inrishi_Website";

export function getSiteBasePath(): string {
  if (typeof window === "undefined") return "";
  if (!window.location.hostname.toLowerCase().endsWith(".github.io")) return "";
  const first = window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  return first.toLowerCase() === GITHUB_REPOSITORY.toLowerCase() ? `/${first}` : "";
}

export function siteHref(path: string): string {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(path)) return path;
  const base = getSiteBasePath();
  if (path === "/") return `${base}/`;
  if (path.startsWith("/")) return `${base}${path}`;
  return path;
}
