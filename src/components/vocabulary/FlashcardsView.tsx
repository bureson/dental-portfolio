"use client";

import { useState } from "react";
import { shuffle, type Word } from "@/lib/vocabulary";

export function FlashcardsView({ words }: { words: Word[] }) {
  // The parent remounts this view on every tab switch, so shuffling in the
  // lazy initialiser is enough — no effect needed.
  const [order, setOrder] = useState<number[]>(() => shuffle(words.length));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const reshuffle = () => {
    setOrder(shuffle(words.length));
    setIdx(0);
    setFlipped(false);
  };

  const card = words.length > 0 ? words[order[idx] ?? 0] : undefined;
  const step = (by: number) => {
    if (words.length === 0) return;
    setIdx((i) => (i + by + words.length) % words.length);
    setFlipped(false);
  };

  return (
    <div className="flex flex-col items-center gap-[22px]">
      {/* The perspective has to sit on the parent, not on the rotating element
          itself, or the turn reads flat. */}
      <div className="w-full max-w-[520px] perspective-[1200px]">
        <button
          type="button"
          onClick={() => card && setFlipped((v) => !v)}
          aria-live="polite"
          className={`relative h-[300px] w-full transition-transform duration-500 ease-out transform-3d select-none motion-reduce:transition-none ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          <Face
            label={card ? "česky" : ""}
            word={card ? card.front : "Přidej nejdřív slovíčka"}
            hidden={flipped}
          />
          <Face
            label="anglicky"
            word={card ? card.back : ""}
            hidden={!flipped}
            back
          />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!card}
          className="rounded-full border-[1.5px] border-slov-border bg-white px-[22px] py-[11px] text-[15px] font-bold text-slov-ink transition-colors hover:border-slov-teal hover:text-slov-teal disabled:opacity-40"
        >
          ← Předchozí
        </button>
        <span className="min-w-16 text-center text-sm font-bold text-slov-muted">
          {card ? `${idx + 1} / ${words.length}` : "0 / 0"}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!card}
          className="rounded-full bg-slov-teal px-6 py-3 text-[15px] font-bold text-slov-bg transition-colors hover:bg-slov-teal-dark disabled:opacity-40"
        >
          Další →
        </button>
      </div>

      <button
        type="button"
        onClick={reshuffle}
        className="text-[13.5px] font-bold text-bronze transition-colors hover:text-slov-rust"
      >
        ⟲ Zamíchat znovu
      </button>
    </div>
  );
}

/**
 * One side of the card. Both sides are always in the DOM, stacked and with
 * their backs hidden — that is what makes the turn continuous rather than a
 * swap of contents. `aria-hidden` keeps the side facing away from being read
 * aloud, so the button announces only what is actually visible.
 */
function Face({
  label,
  word,
  hidden,
  back = false,
}: {
  label: string;
  word: string;
  hidden: boolean;
  back?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-slov-line shadow-[0_10px_30px_rgba(62,124,138,0.10)] backface-hidden ${
        back ? "rotate-y-180 bg-slov-teal-dark" : "bg-white"
      }`}
    >
      <span
        className={`text-xs font-extrabold tracking-[0.12em] uppercase ${
          back ? "text-slov-flip-hint" : "text-slov-hint"
        }`}
      >
        {label}
      </span>
      <span
        className={`px-8 text-center font-slov-display text-[clamp(2rem,7vw,42px)] font-medium ${
          back ? "text-slov-bg" : "text-slov-ink"
        }`}
      >
        {word}
      </span>
      <span
        className={`text-[13px] ${back ? "text-slov-flip-hint" : "text-slov-hint"}`}
      >
        klepni pro otočení
      </span>
    </div>
  );
}
