"use client";

import Link from "next/link";
import { useState } from "react";
import { FlashcardsView } from "@/components/vocabulary/FlashcardsView";
import { ListView } from "@/components/vocabulary/ListView";
import { QuizView } from "@/components/vocabulary/QuizView";
import { useAuth } from "@/lib/auth";
import { useWords } from "@/lib/vocabulary";

type Tab = "list" | "flashcards" | "quiz";

const TABS: { id: Tab; label: string }[] = [
  { id: "list", label: "Slovíčka" },
  { id: "flashcards", label: "Kartičky" },
  { id: "quiz", label: "Zkoušení" },
];

export default function VocabularyPage() {
  const { ready, loggedIn } = useAuth();
  const { words, loaded, error, save } = useWords();
  const [tab, setTab] = useState<Tab>("list");

  if (!ready) return null;
  if (!loggedIn) return <Locked />;

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-7 px-6 pt-10 pb-20">
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-slov-display text-[34px] font-medium">
            Slovníček ✳
          </h1>
          <p className="m-0 text-sm text-slov-muted">
            Tvá soukromá kartotéka slovíček
          </p>
        </div>
        <Link href="/" className="text-[13.5px] font-bold text-slov-teal hover:text-slov-teal-dark">
          ← Zpět na web
        </Link>
      </header>

      <div
        role="tablist"
        aria-label="Režim učení"
        className="flex gap-2 self-start rounded-full border border-slov-line bg-white p-1.5"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? "bg-slov-teal text-slov-bg"
                  : "text-slov-ink-soft hover:text-slov-teal"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="m-0 rounded-2xl border border-slov-clay-dark bg-slov-clay-soft px-4 py-3 text-sm font-semibold text-slov-rust"
        >
          {error}
        </p>
      )}

      {/* Views are keyed by tab so switching restarts a round cleanly. */}
      {!loaded ? null : tab === "list" ? (
        <ListView words={words} save={save} />
      ) : tab === "flashcards" ? (
        <FlashcardsView key="flashcards" words={words} />
      ) : (
        <QuizView key="quiz" words={words} />
      )}
    </div>
  );
}

/**
 * Shown to anyone who reaches the URL without being signed in. The check runs
 * in the browser, so treat this as a curtain over the page — the words
 * themselves live in the visitor's own storage, not behind the login.
 */
function Locked() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 px-6">
      <h1 className="m-0 font-slov-display text-[28px] font-medium">
        Soukromá stránka
      </h1>
      <p className="m-0 text-sm text-slov-muted">
        Slovníček se otevře po přihlášení.
      </p>
      <Link
        href="/login"
        className="self-start rounded-xl bg-slov-teal px-5 py-3 text-[15px] font-bold text-slov-bg transition-colors hover:bg-slov-teal-dark"
      >
        Přihlásit se
      </Link>
      <Link
        href="/"
        className="text-[13.5px] font-bold text-slov-teal hover:text-slov-teal-dark"
      >
        ← Zpět na web
      </Link>
    </div>
  );
}
