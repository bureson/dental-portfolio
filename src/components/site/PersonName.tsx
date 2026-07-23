"use client";

import { useSyncExternalStore } from "react";
import { nameAt, SURNAME_CHANGES_AT } from "@/lib/content";

/** setTimeout tops out near 24.8 days, so a long wait is armed in chunks. */
const MAX_TIMEOUT = 2_147_483_647;

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const arm = () => {
    const remaining = SURNAME_CHANGES_AT - Date.now();
    if (remaining <= 0) return;
    timer = setTimeout(() => {
      onChange();
      arm();
    }, Math.min(remaining, MAX_TIMEOUT));
  };

  arm();
  return () => clearTimeout(timer);
}

const getSnapshot = () => nameAt(Date.now());

/**
 * The surname that is correct right now.
 *
 * This is a static export, so the HTML carries whatever was true when it was
 * built — that is `initial`, and rendering it first is what keeps hydration
 * from mismatching. The browser then reads the real clock, correcting a stale
 * build immediately, and again if the moment passes with the page left open.
 */
export function PersonName({ initial }: { initial: string }) {
  const name = useSyncExternalStore(subscribe, getSnapshot, () => initial);
  return <>{name}</>;
}
