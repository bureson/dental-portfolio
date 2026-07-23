/**
 * Near-duplicate detection for the vocabulary list.
 *
 * Deliberately free of React and Firebase imports: it is pure string work, so
 * it can be reasoned about — and run — on its own.
 */

type Entry = { id: number; front: string; back: string };

/**
 * Lowercased, trimmed and stripped of diacritics, so "Úsměv " and "usmev"
 * compare equal. NFD splits an accented letter into base + combining mark; the
 * replaced range is the combining marks block, which covers every Czech accent
 * including the ring on "ů".
 */
export function fold(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Levenshtein distance, kept to a single working row. */
export function distance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1, // deletion
        current[j - 1] + 1, // insertion
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), // substitution
      );
    }
    previous = current;
  }
  return previous[b.length];
}

/**
 * Close enough to be worth a second look. Short words get no slack — at three
 * letters a single edit is usually a different word ("zub" vs "dub") rather
 * than a typo — while longer ones allow roughly one edit per four characters.
 */
export function alike(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const longest = Math.max(a.length, b.length);
  const allowed = longest <= 3 ? 0 : longest <= 6 ? 1 : Math.floor(longest / 4);
  return allowed > 0 && distance(a, b) <= allowed;
}

/**
 * The existing entry most likely to be a duplicate of the one being added, or
 * null. Either column matching is enough: "zub/tooth" against "zuby/tooth" is
 * worth flagging even though only one side is close.
 *
 * `ignoreId` keeps a word being edited from matching itself.
 */
export function findSimilar<T extends Entry>(
  words: T[],
  front: string,
  back: string,
  ignoreId: number | null = null,
): T | null {
  const f = fold(front);
  const b = fold(back);
  return (
    words.find(
      (w) =>
        w.id !== ignoreId &&
        (alike(fold(w.front), f) || alike(fold(w.back), b)),
    ) ?? null
  );
}
