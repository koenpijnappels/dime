"use client";

import { useCallback, useEffect, useState } from "react";
import StartScreen from "@/components/StartScreen";
import CardScreen from "@/components/CardScreen";
import { QUESTIONS } from "@/lib/questions";
import { pickNextCard } from "@/lib/cardEngine";
import { haptic } from "@/lib/haptics";
import {
  applyTheme,
  resolveInitialTheme,
  storeTheme,
  getStoredTheme,
} from "@/lib/theme";
import type {
  ConversationCard,
  Difficulty,
  Mode,
  Theme,
} from "@/lib/types";

type Phase = "start" | "cards";

const LS_LEVEL = "dime:level";
const LS_MODE = "dime:mode";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");
  const [level, setLevel] = useState<Difficulty | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  // Card flow state
  const [history, setHistory] = useState<ConversationCard[]>([]);
  const [index, setIndex] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [exhausted, setExhausted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const [theme, setTheme] = useState<Theme>("light");

  // ── Theme + persisted selections + service worker (client only) ──
  useEffect(() => {
    setTheme(resolveInitialTheme());
    try {
      const storedLevel = localStorage.getItem(LS_LEVEL);
      const storedMode = localStorage.getItem(LS_MODE);
      if (
        storedLevel === "principiante" ||
        storedLevel === "intermedio" ||
        storedLevel === "avanzado"
      ) {
        setLevel(storedLevel);
      }
      if (storedMode && QUESTIONS.some((q) => q.mode === storedMode)) {
        setMode(storedMode as Mode);
      }
    } catch {
      // ignore storage errors
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // installability is best-effort
      });
    }
  }, []);

  // Follow system changes only while no manual preference is stored.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme() === null) setTheme(mql.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Keep the <html> class in sync with the theme on every change.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      storeTheme(next);
      return next;
    });
  }, []);

  // ── Card flow helpers ──
  const startFlow = useCallback(
    (m: Mode, l: Difficulty) => {
      const first = pickNextCard(QUESTIONS, m, l, new Set(), 0);
      setHistory(first ? [first] : []);
      setIndex(0);
      setSeenIds(first ? new Set([first.id]) : new Set());
      setExhausted(first === null);
      setShowTranslation(false);
    },
    []
  );

  const handleStart = useCallback(() => {
    if (!level || !mode) return;
    try {
      localStorage.setItem(LS_LEVEL, level);
      localStorage.setItem(LS_MODE, mode);
    } catch {
      // ignore
    }
    startFlow(mode, level);
    setPhase("cards");
  }, [level, mode, startFlow]);

  const handleNext = useCallback(() => {
    if (!mode || !level || exhausted) return;
    setShowTranslation(false);

    // Re-show a card already ahead in history (user had gone back).
    if (index < history.length - 1) {
      setIndex(index + 1);
      haptic(10);
      return;
    }

    const next = pickNextCard(QUESTIONS, mode, level, seenIds, history.length);
    if (!next) {
      setExhausted(true);
      return;
    }
    setHistory((h) => [...h, next]);
    setSeenIds((s) => new Set(s).add(next.id));
    setIndex((i) => i + 1);
    haptic(10);
  }, [mode, level, exhausted, index, history, seenIds]);

  const handleBack = useCallback(() => {
    setShowTranslation(false);
    if (exhausted) {
      setExhausted(false);
      haptic(10);
      return;
    }
    if (index > 0) {
      setIndex(index - 1);
      haptic(10);
    }
  }, [exhausted, index]);

  const handleHome = useCallback(() => {
    setPhase("start");
    setExhausted(false);
  }, []);

  const handleRestart = useCallback(() => {
    if (mode && level) startFlow(mode, level);
  }, [mode, level, startFlow]);

  // Changing level or mode invalidates the current flow.
  const handleLevelChange = useCallback((l: Difficulty) => setLevel(l), []);
  const handleModeChange = useCallback((m: Mode) => setMode(m), []);

  if (phase === "start" || !mode || !level) {
    return (
      <StartScreen
        level={level}
        mode={mode}
        theme={theme}
        onLevelChange={handleLevelChange}
        onModeChange={handleModeChange}
        onToggleTheme={toggleTheme}
        onStart={handleStart}
      />
    );
  }

  const currentCard = exhausted ? null : history[index] ?? null;
  const canGoBack = exhausted || index > 0;

  return (
    <CardScreen
      card={currentCard}
      mode={mode}
      level={level}
      theme={theme}
      showTranslation={showTranslation}
      canGoBack={canGoBack}
      onBack={handleBack}
      onNext={handleNext}
      onToggleTranslation={() => setShowTranslation((v) => !v)}
      onToggleTheme={toggleTheme}
      onHome={handleHome}
      onRestart={handleRestart}
    />
  );
}
