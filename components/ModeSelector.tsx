"use client";

import { MODES, type Mode } from "@/lib/types";

type Props = {
  value: Mode | null;
  onChange: (mode: Mode) => void;
};

// Map accent token → selected styles (kept explicit so Tailwind keeps the classes).
const ACCENT: Record<string, { ring: string; bg: string; text: string }> = {
  terracotta: { ring: "border-terracotta", bg: "bg-terracotta/10", text: "text-terracotta" },
  olive: { ring: "border-olive", bg: "bg-olive/10", text: "text-olive" },
  sea: { ring: "border-sea", bg: "bg-sea/10", text: "text-sea" },
  clay: { ring: "border-clay", bg: "bg-clay/10", text: "text-clay" },
};

export default function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MODES.map((mode) => {
        const selected = value === mode.id;
        const accent = ACCENT[mode.accent] ?? ACCENT.terracotta;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            aria-pressed={selected}
            className={[
              "flex flex-col rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.98]",
              selected
                ? `${accent.ring} ${accent.bg} shadow-soft`
                : "border-line bg-paper/60 hover:bg-paper",
            ].join(" ")}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              {mode.emoji}
            </span>
            <span
              className={[
                "mt-2 font-serif text-base font-semibold",
                selected ? accent.text : "text-ink",
              ].join(" ")}
            >
              {mode.label}
            </span>
            <span className="mt-0.5 text-xs leading-snug text-muted">
              {mode.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
