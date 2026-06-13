/**
 * Subtle haptic feedback for supported mobile browsers.
 * Silently does nothing where the Vibration API is unavailable.
 */
export function haptic(pattern: number | number[] = 10): void {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw if called outside a user gesture; ignore.
  }
}
