"use client";

import { useEffect, useRef, useState } from "react";
import { Pagination } from "@/components/vocabulary/Pagination";
import { findSimilar } from "@/lib/similarity";
import type { Word } from "@/lib/vocabulary";

type Props = {
  words: Word[];
  save: (next: Word[]) => void;
};

const PAGE_SIZE = 50;

export function ListView({ words, save }: Props) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  /** A near-duplicate the visitor has been warned about but not yet accepted. */
  const [similar, setSimilar] = useState<Word | null>(null);
  /** The word awaiting a delete confirmation, if any. */
  const [pendingDelete, setPendingDelete] = useState<Word | null>(null);
  const [page, setPage] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listTop = useRef<HTMLParagraphElement>(null);

  const pageCount = Math.max(1, Math.ceil(words.length / PAGE_SIZE));
  // Clamped rather than corrected in an effect: deleting the last word on the
  // final page shrinks the range, and a stale `page` would render nothing.
  const currentPage = Math.min(page, pageCount);
  const firstOnPage = (currentPage - 1) * PAGE_SIZE;
  const visible = words.slice(firstOnPage, firstOnPage + PAGE_SIZE);

  const goToPage = (next: number) => {
    setPage(next);
    // Otherwise the new page opens wherever the old one was scrolled to.
    listTop.current?.scrollIntoView({ block: "start" });
  };

  // `showModal()` is what makes it a real modal — focus trapped, Esc closing,
  // backdrop rendered. React cannot express that through props alone.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pendingDelete && !dialog.open) dialog.showModal();
    if (!pendingDelete && dialog.open) dialog.close();
  }, [pendingDelete]);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    save(words.filter((w) => w.id !== pendingDelete.id));
    if (editId === pendingDelete.id) resetForm();
    setPendingDelete(null);
  };

  const commit = (f: string, b: string) => {
    save(
      editId !== null
        ? words.map((w) => (w.id === editId ? { ...w, front: f, back: b } : w))
        : [{ id: Date.now(), front: f, back: b }, ...words],
    );
    setFront("");
    setBack("");
    setEditId(null);
    setSimilar(null);
    // A new word is prepended, so page one is where it will show up.
    if (editId === null) setPage(1);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const f = front.trim();
    const b = back.trim();
    if (!f || !b) return;

    // Warn once. Submitting again without changing anything means "yes, really"
    // — editing either field clears the warning and re-checks.
    if (!similar) {
      const match = findSimilar(words, f, b, editId);
      if (match) {
        setSimilar(match);
        return;
      }
    }
    commit(f, b);
  };

  /** Back to an empty form: abandons an edit in progress and any warning. */
  const resetForm = () => {
    setEditId(null);
    setFront("");
    setBack("");
    setSimilar(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-[18px] border border-slov-line bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <h2 className="m-0 text-[13px] font-extrabold tracking-[0.08em] text-slov-teal uppercase">
            {editId !== null ? "Upravit slovíčko" : "Přidat slovíčko"}
          </h2>
          {editId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-slov-muted hover:text-slov-rust"
            >
              zrušit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={front}
            onChange={(e) => {
              setFront(e.target.value);
              setSimilar(null);
            }}
            placeholder="česky"
            aria-label="česky"
            className="rounded-xl border-[1.5px] border-slov-border bg-slov-bg px-3.5 py-[11px] text-[15px] outline-none focus:border-slov-teal"
          />
          <input
            value={back}
            onChange={(e) => {
              setBack(e.target.value);
              setSimilar(null);
            }}
            placeholder="anglicky"
            aria-label="anglicky"
            className="rounded-xl border-[1.5px] border-slov-border bg-slov-bg px-3.5 py-[11px] text-[15px] outline-none focus:border-slov-teal"
          />
          <button
            type="submit"
            className="rounded-xl bg-slov-teal px-[22px] py-[11px] text-[15px] font-bold text-slov-bg transition-colors hover:bg-slov-teal-dark"
          >
            {editId !== null ? "Uložit" : "Přidat"}
          </button>
        </div>

        {similar && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-slov-clay-soft px-4 py-3 text-[13.5px] text-slov-rust"
          >
            <span>
              Podobné slovíčko už tu je:{" "}
              <strong className="font-bold">
                {similar.front} — {similar.back}
              </strong>
            </span>
            <span className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-lg bg-slov-rust px-3 py-1.5 text-[12.5px] font-bold text-slov-bg transition-opacity hover:opacity-90"
              >
                {editId !== null ? "Uložit přesto" : "Přidat přesto"}
              </button>
              {/* `type="button"` — inside a form, anything else submits it. */}
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slov-rust/40 px-3 py-1.5 text-[12.5px] font-bold text-slov-rust transition-colors hover:bg-slov-clay-dark"
              >
                Zrušit
              </button>
            </span>
          </div>
        )}
      </form>

      <div className="flex flex-col gap-2">
        <p
          ref={listTop}
          className="m-0 scroll-mt-4 text-[13px] font-semibold text-slov-muted"
        >
          {pageCount > 1
            ? `${firstOnPage + 1}–${firstOnPage + visible.length} z ${words.length} slovíček`
            : `${words.length} slovíček`}
        </p>
        {visible.map((w) => (
          <div
            key={w.id}
            className="flex items-center gap-3 rounded-2xl border border-slov-line bg-white px-4 py-3 sm:gap-3.5 sm:px-[18px]"
          >
            {/* Stacked on a phone, two columns once there is width for them.
                Wrapping instead would drop the buttons onto a line of their
                own, adrift at the left edge. */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3.5">
              <span className="min-w-0 flex-1 text-[15.5px] font-bold break-words">
                {w.front}
              </span>
              <span className="min-w-0 flex-1 text-[14.5px] break-words text-slov-ink-soft sm:text-[15.5px]">
                {w.back}
              </span>
            </div>

            {/* Naming the word in the label keeps the rows distinguishable
                when a screen reader lists the buttons on their own. */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setFront(w.front);
                  setBack(w.back);
                  setEditId(w.id);
                }}
                title="Upravit"
                aria-label={`Upravit ${w.front}`}
                className="flex size-9 items-center justify-center rounded-lg bg-slov-mist text-slov-teal-dark transition-colors hover:bg-slov-mist-dark"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(w)}
                title="Smazat"
                aria-label={`Smazat ${w.front}`}
                className="flex size-9 items-center justify-center rounded-lg bg-slov-clay-soft text-slov-rust transition-colors hover:bg-slov-clay-dark"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        {words.length === 0 && (
          <p className="m-0 rounded-2xl border border-dashed border-slov-border px-4 py-8 text-center text-sm text-slov-muted">
            Zatím tu nic není — přidej první slovíčko výše.
          </p>
        )}

        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onChange={goToPage}
        />
      </div>

      {/* `onClose` also covers Esc and the backdrop, so the state can never be
          left holding a word after the dialog has gone. */}
      <dialog
        ref={dialogRef}
        onClose={() => setPendingDelete(null)}
        aria-labelledby="smazat-nadpis"
        className="m-auto w-[calc(100%-2rem)] max-w-[360px] rounded-2xl border border-slov-line bg-white p-6 text-slov-ink backdrop:bg-slov-ink/40"
      >
        <h2
          id="smazat-nadpis"
          className="m-0 font-slov-display text-[22px] font-medium"
        >
          Smazat slovíčko?
        </h2>
        <p className="mt-2 mb-0 text-sm leading-[1.6] text-slov-ink-soft">
          <strong className="font-bold text-slov-ink">
            {pendingDelete?.front} — {pendingDelete?.back}
          </strong>
        </p>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={() => setPendingDelete(null)}
            className="rounded-xl border-[1.5px] border-slov-border bg-white px-4 py-2.5 text-[14.5px] font-bold text-slov-ink transition-colors hover:border-slov-teal hover:text-slov-teal"
          >
            Zrušit
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-xl bg-slov-rust px-4 py-2.5 text-[14.5px] font-bold text-slov-bg transition-opacity hover:opacity-90"
          >
            Smazat
          </button>
        </div>
      </dialog>
    </div>
  );
}

/**
 * Row action icons. Inline rather than from an icon package: two shapes do not
 * justify a dependency, and the site is a static export with no external
 * requests. They inherit `currentColor`, so the button's text colour drives
 * them and hover keeps working.
 */
const iconProps = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-[17px]",
} as const;

function PencilIcon() {
  return (
    <svg {...iconProps}>
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
