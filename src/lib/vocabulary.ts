"use client";

import { onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { databaseConfigured, getDatabaseClient } from "@/lib/firebase";

export type Word = {
  id: number;
  front: string;
  back: string;
};

const UNAVAILABLE =
  "Slovíčka se nepodařilo načíst — databáze není nastavená. Doplňte NEXT_PUBLIC_FIREBASE_DATABASE_URL.";
const READ_FAILED = "Slovíčka se nepodařilo načíst.";
const WRITE_FAILED = "Slovíčko se nepodařilo uložit.";

/** Fisher–Yates over indices `0..n-1`. */
export function shuffle(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Loose comparison so casing and stray spaces don't fail a correct answer. */
export function normalize(s: string): string {
  return s.trim().toLowerCase();
}


/* --- Realtime Database, one list shared by everyone -------------------- */

type StoredWord = { front: string; back: string };
type StoredWords = Record<string, StoredWord>;

/**
 * One list for the whole site, not one per account: the id of each word is a
 * direct child. The rules require a signed in visitor to read or write it, so
 * everyone who can reach the page shares — and can edit — the same words.
 */
const VOCABULARY_PATH = "vocabulary";

/**
 * Keys are `w<id>`, never the bare number. Realtime Database turns a map whose
 * keys are small sequential integers into a JSON array — `{1: …, 2: …}` comes
 * back as `[null, …, …]` — and the leading null would then be read as a word.
 * A non-numeric prefix keeps it an object.
 */
const KEY = (id: number) => `w${id}`;
const KEY_PATTERN = /^w\d+$/;

function toWords(stored: StoredWords | null): Word[] {
  return Object.entries(stored ?? {})
    .filter(([id, w]) => KEY_PATTERN.test(id) && w != null)
    .map(([id, w]) => ({
      id: Number(id.slice(1)),
      front: w.front,
      back: w.back,
    }))
    .sort((a, b) => b.id - a.id);
}

function toStored(words: Word[]): StoredWords {
  const stored: StoredWords = {};
  for (const w of words) stored[KEY(w.id)] = { front: w.front, back: w.back };
  return stored;
}

/**
 * The shared word list, kept in sync with the Realtime Database. Every signed
 * in visitor, tab and device sees the same list, and edits land in all of them
 * without a reload.
 *
 * An emptied list simply removes the node — Realtime Database drops anything
 * whose value is an empty object — and reads back as no words at all, which is
 * exactly right.
 */
export function useWords() {
  const { loggedIn } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabaseClient();
    // The rules reject anonymous reads, so wait until sign-in has resolved.
    if (!loggedIn || !db) return;

    return onValue(
      ref(db, VOCABULARY_PATH),
      (snapshot) => {
        setWords(toWords(snapshot.val() as StoredWords | null));
        setError(null);
        setLoaded(true);
      },
      () => {
        setError(READ_FAILED);
        setLoaded(true);
      },
    );
  }, [loggedIn]);

  const save = useCallback(
    (next: Word[]) => {
      const db = getDatabaseClient();
      if (!loggedIn || !db) return;
      // Show the edit immediately; the subscription confirms it a moment later.
      setWords(next);
      setError(null);
      set(ref(db, VOCABULARY_PATH), toStored(next)).catch(() =>
        setError(WRITE_FAILED),
      );
    },
    [loggedIn],
  );

  return {
    words,
    // Nothing will ever arrive without a database URL, so don't leave the page
    // waiting on a subscription that was never created.
    loaded: loaded || !databaseConfigured,
    error: databaseConfigured ? error : UNAVAILABLE,
    save,
  };
}
