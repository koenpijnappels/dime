import type { Theme } from "./types";

const STORAGE_KEY = "dime:theme";

/** Read the manually saved theme preference, if any. */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

/** Persist a manual theme preference. */
export function storeTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage may be blocked (private mode); ignore.
  }
}

/** The system colour-scheme preference. */
export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Resolve the theme to apply: manual preference wins, else system. */
export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

/** Apply the theme by toggling the `dark` class on <html>. */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

/**
 * Inline script (stringified) run before paint in <head> to set the theme
 * class early and avoid a flash of the wrong colours / hydration mismatch.
 */
export const themeBootstrapScript = `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
