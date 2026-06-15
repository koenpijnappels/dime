/**
 * Centralized, privacy-conscious analytics wrapper for Cartita.
 *
 * The rest of the app calls the small `track*` helpers below instead of
 * importing the analytics provider directly. This keeps event names
 * consistent in one place and makes it trivial to swap providers later.
 *
 * Design notes:
 * - Built on Vercel Analytics custom events (`track`). The `<Analytics />`
 *   component lives in the root layout; `track` queues events safely even
 *   before that script loads, and is a no-op during SSR and when analytics
 *   is not configured (e.g. previews, local dev without a Vercel project).
 * - Every call is wrapped so analytics can never throw into the UI.
 * - We deliberately only send IDs, mode, level, intensity and event types —
 *   never the Spanish question text or the English translation.
 */

import { track } from "@vercel/analytics";
import type { ConversationCard, Difficulty, Mode } from "./types";

/** Method by which the user advanced to the next card. */
export type NextMethod = "button" | "swipe";

/** Possible answers to the after-20-cards feedback prompt. */
export type FeedbackResponse = "yes" | "okay" | "idea" | "dismissed";

/** Stable event names. Kept as a union so typos surface at compile time. */
export type AnalyticsEvent =
  | "app_opened"
  | "difficulty_selected"
  | "mode_selected"
  | "session_started"
  | "card_viewed"
  | "next_card"
  | "previous_card"
  | "translation_revealed"
  | "change_mode_clicked"
  | "change_level_clicked"
  | "feedback_prompt_shown"
  | "feedback_response"
  | "share_clicked";

/** Vercel allows flat primitive property values only. */
type EventProperties = Record<string, string | number | boolean | null>;

/**
 * Low-level event dispatch. Never throws; safe to call anywhere, including
 * during server rendering (where it simply does nothing).
 */
export function trackEvent(
  name: AnalyticsEvent,
  properties?: EventProperties
): void {
  try {
    if (properties) track(name, properties);
    else track(name);
  } catch {
    // Analytics must never break the product experience.
  }
}

// ── App / session ──────────────────────────────────────────────────────────

export function trackAppOpened(): void {
  trackEvent("app_opened");
}

export function trackDifficultySelected(level: Difficulty): void {
  trackEvent("difficulty_selected", { level });
}

export function trackModeSelected(mode: Mode): void {
  trackEvent("mode_selected", { mode });
}

export function trackSessionStarted(level: Difficulty, mode: Mode): void {
  trackEvent("session_started", { level, mode });
}

// ── Cards ────────────────────────────────────────────────────────────────--

export function trackCardViewed(card: ConversationCard): void {
  // Only identifiers and metadata — no question or translation text.
  const props: EventProperties = {
    cardId: card.id,
    level: card.level,
    mode: card.mode,
  };
  if (card.intensity !== undefined) props.intensity = card.intensity;
  trackEvent("card_viewed", props);
}

export function trackNextCard(
  method: NextMethod,
  level: Difficulty,
  mode: Mode
): void {
  trackEvent("next_card", { method, level, mode });
}

export function trackPreviousCard(level: Difficulty, mode: Mode): void {
  trackEvent("previous_card", { level, mode });
}

export function trackTranslationRevealed(card: ConversationCard): void {
  trackEvent("translation_revealed", {
    cardId: card.id,
    level: card.level,
    mode: card.mode,
  });
}

// ── Navigation changes ──────────────────────────────────────────────────--

export function trackChangeModeClicked(): void {
  trackEvent("change_mode_clicked");
}

export function trackChangeLevelClicked(): void {
  trackEvent("change_level_clicked");
}

// ── Feedback ─────────────────────────────────────────────────────────────--

export function trackFeedbackPromptShown(): void {
  trackEvent("feedback_prompt_shown");
}

export function trackFeedbackResponse(response: FeedbackResponse): void {
  trackEvent("feedback_response", { response });
}

export function trackShareClicked(source: string): void {
  trackEvent("share_clicked", { source });
}
