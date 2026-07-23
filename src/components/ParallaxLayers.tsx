"use client";

import { useEffect } from "react";

/**
 * Drives every `[data-plx]` element on the page: each one is translated
 * vertically in proportion to its distance from the viewport centre, where the
 * attribute value is the speed (negative = drifts against the scroll).
 *
 * Mount once per page; the markup itself stays in server components.
 */
export function ParallaxLayers() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-plx]"),
    )
      .map((el) => ({ el, speed: Number.parseFloat(el.dataset.plx ?? "0") }))
      .filter((layer) => layer.speed);
    if (layers.length === 0) return;

    for (const { el } of layers) el.style.willChange = "transform";

    /**
     * Each layer's untransformed centre, in document coordinates. Measuring up
     * front is what keeps the effect honest: reading the rect mid-scroll would
     * return a position that already includes the transform written on the
     * previous frame, so every offset would be derived from the last one and
     * the layers would trail the scroll instead of tracking it.
     */
    let centres: number[] = [];
    const measure = () => {
      // Clear every transform first, then read — batched to one style recalc.
      for (const { el } of layers) el.style.transform = "";
      centres = layers.map(({ el }) => {
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
      });
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      // Write-only: no layout is read here, so scrolling stays off the main
      // thread's critical path.
      const viewportCentre = window.scrollY + window.innerHeight / 2;
      for (let i = 0; i < layers.length; i++) {
        const offset = (centres[i] - viewportCentre) * layers[i].speed;
        layers[i].el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    let live = true;
    const onResize = () => {
      if (!live) return;
      measure();
      update();
    };

    measure();
    update();
    // Webfont swap reflows the page under the already-measured layers.
    document.fonts?.ready.then(onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      live = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      for (const { el } of layers) {
        el.style.willChange = "";
        el.style.transform = "";
      }
    };
  }, []);

  return null;
}
