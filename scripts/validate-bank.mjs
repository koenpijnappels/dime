// Throwaway sanity check for the question bank. Parses lib/questions.ts as text
// and asserts counts, coverage, uniqueness, and per-mode requirements.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "..", "lib", "questions.ts"), "utf8");

const objectRe = /\{\s*id:\s*"([^"]+)",\s*mode:\s*"([^"]+)",\s*level:\s*"([^"]+)"([^}]*)\}/g;

const cards = [];
let m;
while ((m = objectRe.exec(src)) !== null) {
  const [, id, mode, level, rest] = m;
  cards.push({
    id,
    mode,
    level,
    hasHint: /hintEs:/.test(rest),
    hasIntensity: /intensity:/.test(rest),
  });
}

const errors = [];
const ok = (cond, msg) => {
  if (!cond) errors.push(msg);
};

ok(cards.length === 1500, `expected 1500 cards, found ${cards.length}`);

// unique ids
const ids = new Set();
for (const c of cards) {
  if (ids.has(c.id)) errors.push(`duplicate id: ${c.id}`);
  ids.add(c.id);
}

const TARGET = {
  mezcla: 180,
  rompehielos: 180,
  amigos: 180,
  conocerse: 225,
  cita: 195,
  "mas-profundo": 195,
  debate: 180,
  practica: 165,
};
const LEVELS = ["principiante", "intermedio", "avanzado"];

const byMode = {};
for (const c of cards) {
  byMode[c.mode] ??= { total: 0, levels: {} };
  byMode[c.mode].total++;
  byMode[c.mode].levels[c.level] = (byMode[c.mode].levels[c.level] ?? 0) + 1;
}

for (const [mode, target] of Object.entries(TARGET)) {
  const info = byMode[mode];
  ok(info, `missing mode: ${mode}`);
  if (!info) continue;
  ok(info.total === target, `${mode}: expected ${target}, got ${info.total}`);
  for (const lvl of LEVELS) {
    ok((info.levels[lvl] ?? 0) > 0, `${mode}: no cards for level ${lvl}`);
  }
}

// every practica card has a hint
for (const c of cards.filter((c) => c.mode === "practica")) {
  ok(c.hasHint, `practica card without hintEs: ${c.id}`);
}
// every mas-profundo card has intensity
for (const c of cards.filter((c) => c.mode === "mas-profundo")) {
  ok(c.hasIntensity, `mas-profundo card without intensity: ${c.id}`);
}

console.log("Mode distribution:");
for (const [mode, info] of Object.entries(byMode)) {
  console.log(`  ${mode.padEnd(13)} ${info.total}  ${JSON.stringify(info.levels)}`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} problem(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`\n✅ All checks passed (${cards.length} cards).`);
