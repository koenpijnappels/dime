"use client";

import Link from "next/link";
import type { Difficulty, Mode, Theme } from "@/lib/types";
import DifficultySelector from "./DifficultySelector";
import ModeSelector from "./ModeSelector";
import ThemeToggle from "./ThemeToggle";

type Props = {
  level: Difficulty | null;
  mode: Mode | null;
  theme: Theme;
  onLevelChange: (level: Difficulty) => void;
  onModeChange: (mode: Mode) => void;
  onToggleTheme: () => void;
  onStart: () => void;
};

export default function StartScreen({
  level,
  mode,
  theme,
  onLevelChange,
  onModeChange,
  onToggleTheme,
  onStart,
}: Props) {
  const ready = level !== null && mode !== null;

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-6">
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl font-semibold tracking-tight text-ink">
            Cartita
          </span>
          <span className="h-2 w-2 rounded-full bg-terracotta" aria-hidden="true" />
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <p className="mt-2 font-serif text-lg italic text-muted">
        Cartas para hablar en español.
      </p>

      <div className="mt-7 animate-fade-up">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Elige un nivel
        </h2>
        <DifficultySelector value={level} onChange={onLevelChange} />
      </div>

      <div className="mt-7 animate-fade-up">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Elige un modo
        </h2>
        <ModeSelector value={mode} onChange={onModeChange} />
      </div>

      <div className="mt-8 flex-1" />

      <button
        type="button"
        onClick={onStart}
        disabled={!ready}
        className={[
          "sticky bottom-4 w-full rounded-2xl px-6 py-4 font-serif text-lg font-semibold transition-all",
          ready
            ? "bg-terracotta text-paper shadow-card active:scale-[0.99]"
            : "cursor-not-allowed bg-line/60 text-muted",
        ].join(" ")}
      >
        {ready ? "Empezar" : "Elige nivel y modo"}
      </button>

      <footer className="mt-4 text-center">
        <Link
          href="/privacidad"
          className="text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Privacidad
        </Link>
      </footer>
    </div>
  );
}
