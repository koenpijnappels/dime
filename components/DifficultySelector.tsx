"use client";

import { LEVELS, type Difficulty } from "@/lib/types";

type Props = {
  value: Difficulty | null;
  onChange: (level: Difficulty) => void;
};

export default function DifficultySelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {LEVELS.map((level) => {
        const selected = value === level.id;
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onChange(level.id)}
            aria-pressed={selected}
            className={[
              "rounded-2xl border px-4 py-4 text-left transition-all active:scale-[0.98]",
              selected
                ? "border-terracotta bg-terracotta/10 shadow-soft"
                : "border-line bg-paper/60 hover:border-terracotta/50 hover:bg-paper",
            ].join(" ")}
          >
            <div className="font-serif text-lg font-semibold text-ink">
              {level.label}
            </div>
            <div className="mt-0.5 text-sm leading-snug text-muted">
              {level.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
