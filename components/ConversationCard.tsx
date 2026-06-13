"use client";

import { motion, type PanInfo } from "framer-motion";
import type { ConversationCard as Card } from "@/lib/types";

type Props = {
  card: Card;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  onSwipeNext: () => void;
};

const SWIPE_DISTANCE = 90; // px past which a horizontal drag counts as "next"
const SWIPE_VELOCITY = 450;

export default function ConversationCard({
  card,
  showTranslation,
  onToggleTranslation,
  onSwipeNext,
}: Props) {
  function handleDragEnd(_: unknown, info: PanInfo) {
    const far = Math.abs(info.offset.x) > SWIPE_DISTANCE;
    const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY;
    if (far || fast) onSwipeNext();
  }

  return (
    <motion.article
      // Remounts per card (keyed in parent) so each card animates in calmly.
      drag="x"
      dragSnapToOrigin
      dragElastic={0.18}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative flex min-h-[58dvh] w-full cursor-grab touch-pan-y select-none flex-col rounded-[2rem] border border-line bg-paper px-6 py-8 shadow-card"
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-balance font-serif text-[1.7rem] font-semibold leading-snug text-ink sm:text-3xl">
          {card.questionEs}
        </p>

        {card.hintEs && (
          <p className="mt-5 text-sm font-medium uppercase tracking-wide text-clay">
            {card.hintEs}
          </p>
        )}

        {showTranslation && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-sm text-pretty text-base italic leading-relaxed text-muted"
          >
            {card.translationEn}
          </motion.p>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleTranslation}
        className="mx-auto mt-6 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-sand active:scale-95"
      >
        {showTranslation ? "Ocultar traducción" : "Ver traducción"}
      </button>
    </motion.article>
  );
}
