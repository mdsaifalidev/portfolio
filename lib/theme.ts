// The theme class on <html> is set before paint by the inline script in app/layout.tsx.

/** Browser chrome / status-bar colour for each theme; keep in sync with --bg in globals.css. */
export const THEME_COLORS = { light: "#f2f4f5", dark: "#0c1015" } as const;

/** Id of the theme-color meta the pre-paint script prepends to <head> (it outranks Next's per-scheme metas). */
export const LIVE_THEME_COLOR_ID = "theme-color-live";

/** Point the status bar / browser chrome at the active theme so it follows the in-page toggle. */
export function syncThemeColor(theme: keyof typeof THEME_COLORS) {
  let meta = document.getElementById(LIVE_THEME_COLOR_ID) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.id = LIVE_THEME_COLOR_ID;
    document.head.prepend(meta);
  }
  meta.content = THEME_COLORS[theme];
}

export function toggleTheme() {
  const root = document.documentElement;
  const next = root.classList.contains("dark") ? "light" : "dark";

  // Switch the whole page in one frame: without this, elements with hover transitions fade their
  // colours while everything else snaps.
  root.classList.add("theme-switching");
  root.classList.toggle("dark", next === "dark");
  syncThemeColor(next);
  void root.offsetHeight; // apply the new colours before transitions come back
  requestAnimationFrame(() => root.classList.remove("theme-switching"));

  try {
    localStorage.setItem("theme", next);
  } catch {}
}
