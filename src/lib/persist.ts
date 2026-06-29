// Tiny localStorage helpers, SSR-safe.
const KEY = "studyspark:v1";

export type PersistedShape = Record<string, unknown>;

export function loadState(): PersistedShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PersistedShape) : null;
  } catch {
    return null;
  }
}

export function saveState(s: PersistedShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — ignored */
  }
}
