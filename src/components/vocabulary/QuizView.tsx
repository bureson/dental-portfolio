"use client";

import { useCallback, useEffect, useState } from "react";
import { normalize, shuffle, type Word } from "@/lib/vocabulary";

type Direction = "cz" | "en";
type Answer = { ok: boolean; correct: string };

/**
 * How long the result stays on screen before the next question. Also drives
 * the bar draining across the button, so the two can't drift apart.
 */
const AUTO_ADVANCE_MS = 2000;

export function QuizView({ words }: { words: Word[] }) {
  // The parent remounts this view on every tab switch, so shuffling in the
  // lazy initialiser is enough — no effect needed.
  const [order, setOrder] = useState<number[]>(() => shuffle(words.length));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState<Direction>("cz");

  const start = () => {
    setOrder(shuffle(words.length));
    setIdx(0);
    setInput("");
    setAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const word = words.length > 0 ? words[order[idx] ?? 0] : undefined;

  const check = () => {
    if (answer || !word) return;
    const correct = direction === "cz" ? word.back : word.front;
    const ok = normalize(input) === normalize(correct);
    setAnswer({ ok, correct });
    if (ok) setScore((s) => s + 1);
  };

  const next = useCallback(() => {
    setAnswer(null);
    setInput("");
    if (idx + 1 >= order.length) setFinished(true);
    else setIdx(idx + 1);
  }, [idx, order.length]);

  // Move on by itself once the result has been read. Any route out of the
  // answered state — pressing the button, switching direction, starting over,
  // leaving the tab — clears the pending timer through the cleanup.
  useEffect(() => {
    if (!answer) return;
    const timer = setTimeout(next, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [answer, next]);

  if (words.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-slov-border px-4 py-10 text-center text-sm text-slov-muted">
        Ke zkoušení potřebuješ aspoň jedno slovíčko.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {finished ? (
        <div className="flex flex-col items-center gap-3.5 rounded-3xl bg-slov-teal-dark p-11">
          <p className="m-0 font-slov-display text-4xl text-slov-bg">
            Hotovo! 🎉
          </p>
          <p className="m-0 text-[17px] font-semibold text-slov-teal-pale">
            Výsledek: {score} z {order.length} správně
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-2 rounded-full bg-slov-bg px-[26px] py-3 text-[15px] font-extrabold text-slov-teal-dark transition-colors hover:bg-slov-mist"
          >
            Zkusit znovu
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-slov-line bg-white p-6 sm:p-9">
          <p className="m-0 text-[13px] font-bold text-slov-muted">
            Otázka {Math.min(idx + 1, order.length)} / {order.length} · skóre{" "}
            {score}
          </p>
          <p className="m-0 text-xs font-extrabold tracking-[0.12em] text-bronze uppercase">
            {direction === "cz" ? "česky → anglicky" : "anglicky → česky"}
          </p>
          <p className="m-0 text-center font-slov-display text-[clamp(1.75rem,6vw,38px)] font-medium">
            {word ? (direction === "cz" ? word.front : word.back) : ""}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (answer) next();
              else check();
            }}
            className="flex w-full max-w-[440px] gap-2.5"
          >
            {/* `min-w-0` is load-bearing: an input's intrinsic width is about
                20 characters, and a flex item defaults to `min-width: auto`,
                so without it the input refuses to shrink on a narrow screen
                and pushes the button off the right edge. */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="napiš překlad…"
              aria-label="Tvoje odpověď"
              className="w-full min-w-0 flex-1 rounded-xl border-[1.5px] border-slov-border bg-slov-bg px-4 py-3 text-base outline-none focus:border-slov-teal"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-slov-teal px-[22px] py-3 text-[15px] font-bold text-slov-bg transition-colors hover:bg-slov-teal-dark"
            >
              {answer ? "Další" : "Ověřit"}
            </button>
          </form>

          {answer && (
            <div className="flex flex-col items-center gap-3" aria-live="polite">
              <p
                className={`m-0 text-base font-extrabold ${
                  answer.ok ? "text-slov-teal" : "text-slov-rust"
                }`}
              >
                {answer.ok ? "✓ Správně!" : `✗ Správně je: ${answer.correct}`}
              </p>
              <button
                type="button"
                onClick={next}
                className="relative overflow-hidden rounded-full border-[1.5px] border-slov-border bg-white px-6 py-2.5 text-[14.5px] font-bold text-slov-ink transition-colors hover:border-slov-teal hover:text-slov-teal"
              >
                {/* Remounts with each question, so the animation restarts. */}
                <span
                  key={idx}
                  aria-hidden="true"
                  style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                  className="absolute inset-0 origin-left bg-slov-mist animate-[quiz-countdown_linear_forwards]"
                />
                <span className="relative">Další otázka →</span>
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setDirection((d) => (d === "cz" ? "en" : "cz"));
          setAnswer(null);
          setInput("");
        }}
        className="self-center text-[13.5px] font-bold text-bronze transition-colors hover:text-slov-rust"
      >
        ⇄ Prohodit směr zkoušení
      </button>
    </div>
  );
}
