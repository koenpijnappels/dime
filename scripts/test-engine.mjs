// Throwaway runtime test of the card engine against the real bank.
// Run: node scripts/test-engine.mjs
import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Allow importing .ts via Node's built-in type stripping (Node 22.6+/24).
// Falls back gracefully if not needed.
let pickNextCard, QUESTIONS, matchingCards, targetIntensity;
try {
  ({ pickNextCard, matchingCards, targetIntensity } = await import(
    "../lib/cardEngine.ts"
  ));
  ({ QUESTIONS } = await import("../lib/questions.ts"));
} catch (e) {
  console.error("Could not import TS modules directly:", e.message);
  process.exit(2);
}

const fail = (m) => {
  console.error("❌ " + m);
  process.exitCode = 1;
};

// 1) No repeats until exhaustion, for every mode+level combo.
const MODES = [
  "mezcla",
  "rompehielos",
  "amigos",
  "conocerse",
  "cita",
  "mas-profundo",
  "debate",
  "practica",
];
const LEVELS = ["principiante", "intermedio", "avanzado"];

for (const mode of MODES) {
  for (const level of LEVELS) {
    const total = matchingCards(QUESTIONS, mode, level).length;
    const seen = new Set();
    let shown = 0;
    let card = pickNextCard(QUESTIONS, mode, level, seen, shown);
    while (card) {
      if (seen.has(card.id)) {
        fail(`${mode}/${level}: repeated ${card.id}`);
        break;
      }
      seen.add(card.id);
      shown++;
      card = pickNextCard(QUESTIONS, mode, level, seen, shown);
    }
    if (shown !== total) {
      fail(`${mode}/${level}: drew ${shown} of ${total} before exhausting`);
    }
  }
}

// 2) mas-profundo deepens: average intensity of the first 5 cards should be
//    lower than the average of the last 5, across many shuffles.
function runDeep(level) {
  const seen = new Set();
  const seq = [];
  let card = pickNextCard(QUESTIONS, "mas-profundo", level, seen, 0);
  while (card) {
    seq.push(card.intensity ?? 1);
    seen.add(card.id);
    card = pickNextCard(QUESTIONS, "mas-profundo", level, seen, seq.length);
  }
  return seq;
}

for (const level of LEVELS) {
  let firstSum = 0;
  let lastSum = 0;
  const runs = 40;
  for (let i = 0; i < runs; i++) {
    const seq = runDeep(level);
    const first = seq.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const last = seq.slice(-5).reduce((a, b) => a + b, 0) / 5;
    firstSum += first;
    lastSum += last;
  }
  const avgFirst = (firstSum / runs).toFixed(2);
  const avgLast = (lastSum / runs).toFixed(2);
  console.log(
    `mas-profundo/${level}: avg intensity first5=${avgFirst} last5=${avgLast}`
  );
  if (Number(avgLast) <= Number(avgFirst)) {
    fail(`mas-profundo/${level} did not deepen (first ${avgFirst} >= last ${avgLast})`);
  }
}

// 3) targetIntensity ramps 1 → 5 and clamps.
if (targetIntensity(0) !== 1) fail("targetIntensity(0) should be 1");
if (targetIntensity(12) !== 5) fail("targetIntensity(12) should be 5");
if (targetIntensity(100) !== 5) fail("targetIntensity clamps at 5");

if (!process.exitCode) console.log("\n✅ Engine behaves correctly.");
