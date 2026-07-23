"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only touch state when the threshold is actually crossed — otherwise
    // every scroll event schedules React work for an unchanged value.
    let shown = false;
    const onScroll = () => {
      const next = window.scrollY > 600;
      if (next === shown) return;
      shown = next;
      setVisible(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      title="Zpět nahoru"
      aria-label="Zpět nahoru"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-7 bottom-7 z-30 flex size-[46px] items-center justify-center rounded-full border border-line-strong bg-cream/95 text-lg text-sage-dark shadow-[0_4px_14px_rgba(51,48,43,0.12)] transition duration-300 hover:border-sage-dark hover:text-sage-deep ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
