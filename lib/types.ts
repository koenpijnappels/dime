export type Difficulty = "principiante" | "intermedio" | "avanzado";

export type Mode =
  | "mezcla"
  | "rompehielos"
  | "amigos"
  | "conocerse"
  | "cita"
  | "mas-profundo"
  | "debate"
  | "practica";

export type ConversationCard = {
  id: string;
  mode: Mode;
  level: Difficulty;
  questionEs: string;
  translationEn: string;
  hintEs?: string;
  intensity?: 1 | 2 | 3 | 4 | 5;
};

export type Theme = "light" | "dark";

export type ModeMeta = {
  id: Mode;
  label: string;
  description: string;
  accent: string; // tailwind text/border accent token name
  emoji: string;
};

export type LevelMeta = {
  id: Difficulty;
  label: string;
  description: string;
};

export const LEVELS: LevelMeta[] = [
  {
    id: "principiante",
    label: "Principiante",
    description: "Frases sencillas y temas cotidianos.",
  },
  {
    id: "intermedio",
    label: "Intermedio",
    description: "Más vocabulario, opiniones y matices.",
  },
  {
    id: "avanzado",
    label: "Avanzado",
    description: "Ideas abstractas y conversaciones profundas.",
  },
];

export const MODES: ModeMeta[] = [
  {
    id: "mezcla",
    label: "Mezcla",
    description: "Un poco de todo para cualquier momento.",
    accent: "terracotta",
    emoji: "🎴",
  },
  {
    id: "rompehielos",
    label: "Rompehielos",
    description: "Para empezar a hablar sin presión.",
    accent: "sea",
    emoji: "🧊",
  },
  {
    id: "amigos",
    label: "Amigos",
    description: "Divertido y social para el grupo.",
    accent: "olive",
    emoji: "🎉",
  },
  {
    id: "conocerse",
    label: "Conocerse",
    description: "Para descubrir a la otra persona.",
    accent: "clay",
    emoji: "🤝",
  },
  {
    id: "cita",
    label: "Cita",
    description: "Romántico, curioso y cercano.",
    accent: "terracotta",
    emoji: "🌹",
  },
  {
    id: "mas-profundo",
    label: "Más Profundo",
    description: "Empieza suave y se vuelve más íntimo.",
    accent: "sea",
    emoji: "🌊",
  },
  {
    id: "debate",
    label: "Debate",
    description: "Opiniones y temas para pensar.",
    accent: "olive",
    emoji: "💬",
  },
  {
    id: "practica",
    label: "Práctica",
    description: "Para practicar tu español hablando.",
    accent: "clay",
    emoji: "📖",
  },
];

export function modeLabel(id: Mode): string {
  return MODES.find((m) => m.id === id)?.label ?? id;
}

export function levelLabel(id: Difficulty): string {
  return LEVELS.find((l) => l.id === id)?.label ?? id;
}
