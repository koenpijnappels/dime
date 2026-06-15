/**
 * A random per-tab session id, used to group usage events (e.g. to count how
 * many cards were viewed in one session). It is an opaque random value — not
 * a user identifier — and lives only in `sessionStorage`, so it resets when
 * the tab is closed.
 */

const SS_SESSION_ID = "cartita:session_id";

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem(SS_SESSION_ID);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SS_SESSION_ID, id);
    }
    return id;
  } catch {
    // sessionStorage may be unavailable (private mode, etc.).
    return null;
  }
}
