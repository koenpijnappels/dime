import type { ConversationCard, Difficulty, Mode } from "./types";

/** All cards that match the chosen mode and level. */
export function matchingCards(
  allCards: ConversationCard[],
  mode: Mode,
  level: Difficulty
): ConversationCard[] {
  return allCards.filter((c) => c.mode === mode && c.level === level);
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Target intensity band for `mas-profundo`. The deck starts gentle (1–2) and
 * deepens roughly one level every three cards, capped at 5.
 */
export function targetIntensity(cardsShown: number): number {
  return Math.min(5, 1 + Math.floor(cardsShown / 3));
}

/**
 * Pick the next unseen card for the given flow, or `null` when the pool is
 * exhausted. Pure: callers own the `seenIds` set and the count of cards shown.
 */
export function pickNextCard(
  allCards: ConversationCard[],
  mode: Mode,
  level: Difficulty,
  seenIds: ReadonlySet<string>,
  cardsShown: number
): ConversationCard | null {
  const pool = matchingCards(allCards, mode, level).filter(
    (c) => !seenIds.has(c.id)
  );
  if (pool.length === 0) return null;

  if (mode === "mas-profundo") {
    const target = targetIntensity(cardsShown);
    // Prefer unseen cards at or below the current target intensity, then take
    // the deepest available within that ceiling so the flow ramps up smoothly.
    const eligible = pool.filter((c) => (c.intensity ?? 1) <= target);
    const fromPool = eligible.length > 0 ? eligible : pool;
    const maxIntensity = Math.max(
      ...fromPool.map((c) => c.intensity ?? 1)
    );
    const deepest = fromPool.filter(
      (c) => (c.intensity ?? 1) === maxIntensity
    );
    return pickRandom(deepest);
  }

  return pickRandom(pool);
}

/** Whether any unseen card remains for the flow. */
export function hasRemaining(
  allCards: ConversationCard[],
  mode: Mode,
  level: Difficulty,
  seenIds: ReadonlySet<string>
): boolean {
  return matchingCards(allCards, mode, level).some((c) => !seenIds.has(c.id));
}

/** Count of cards available for a flow (used for UI hints / safety checks). */
export function poolSize(
  allCards: ConversationCard[],
  mode: Mode,
  level: Difficulty
): number {
  return matchingCards(allCards, mode, level).length;
}
